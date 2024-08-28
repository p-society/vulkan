package main

import (
	"context"
	"fmt"
	"net/url"
	"os"
	"os/exec"
	"os/signal"
	"strings"
	"syscall"
)

func runCommand(ctx context.Context, name string, args ...string) error {
	cmd := exec.CommandContext(ctx, name, args...)
	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout

	return cmd.Run()
}

func pullSource(repo string) (string, error) {
	p, _ := url.Parse(repo)
	dest := strings.ReplaceAll(p.Path, "/", "-")[1:]
	dest = strings.ReplaceAll(dest, ".git", "")

	_, err := os.Stat(dest)
	if !os.IsNotExist(err) {
		fmt.Println("source already exists.")
		return dest, nil
	}

	err = runCommand(context.Background(), "git", "clone", repo, dest)
	if err != nil {
		return "", fmt.Errorf("error cloning repo: \n%v", err)
	}

	return dest, nil
}

func buildImageAndRun(ctx context.Context, dir string) error {
	imageName := dir
	dfp := "./" + dir

	fmt.Println("building image ...")
	err := runCommand(ctx, "docker", "build", "-t", imageName, dfp)
	if err != nil {
		return fmt.Errorf("error building image: %v", err)
	}
	fmt.Println("build successful!")

	fmt.Println("running image ...")
	err = runCommand(ctx, "docker", "run", "--rm", "-p", "8080:8080", imageName)
	if err != nil {
		return fmt.Errorf("error running image: %v", err)
	}
	fmt.Println("container running...")

	return nil
}

func cleanUp(dir string) {
	fmt.Println("cleaning up source ...")
	err := os.RemoveAll(dir)
	if err != nil {
		fmt.Printf("error deleting directory: %v\n", err)
	} else {
		fmt.Println("source cleaned")
	}
}

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: vulkan <url>")
		return
	}

	url := os.Args[1]

	dir, err := pullSource(url)
	if err != nil {
		fmt.Println(err)
		return
	}

	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	signalChan := make(chan os.Signal, 1)
	signal.Notify(signalChan, os.Interrupt, syscall.SIGTERM)

	go func() {
		err = buildImageAndRun(ctx, dir)
		if err != nil {
			fmt.Println(err)
			cancel()
		}
	}()

	sig := <-signalChan
	fmt.Printf("Received signal: %s. Shutting down...\n", sig)

	cleanUp(dir)
}

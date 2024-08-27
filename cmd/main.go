package main

import (
	"fmt"
	"net/url"
	"os"
	"os/exec"
	"strings"
)

func runCommand(name string, args ...string) error {

	cmd := exec.Command(name, args...)

	cmd.Stderr = os.Stderr
	cmd.Stdout = os.Stdout

	return cmd.Run()

}

func pullSource(repo string) (string, error) {
	p, _ := url.Parse(repo)
	dest := strings.ReplaceAll(p.Path, "/", "-")[1:]
	dest = strings.ReplaceAll(dest, ".git", "")

	err := runCommand("git", "clone", repo, dest)

	if err != nil {
		return "", fmt.Errorf("error cloning repo: \n%v", err)
	}

	return dest, nil
}

func buildImageAndRun(dir string) error {

	imageName := dir
	dfp := "./" + dir

	fmt.Println("building image ...")
	err := runCommand("sudo", "docker", "build", "-t", imageName, dfp)
	if err != nil {
		return fmt.Errorf("error building image: %v", err)
	}
	fmt.Println("build successful!")

	fmt.Println("running image ...")
	err = runCommand("sudo", "docker", "run", "--rm", "-p", "8080:8080", imageName)
	if err != nil {
		return fmt.Errorf("error running image: %v", err)
	}
	fmt.Println("container running...")

	fmt.Println("cleaning up source ...")
	err = os.RemoveAll(dir)
	if err != nil {
		return fmt.Errorf("error deleting directory: %v", err)
	}
	fmt.Println("source cleaned")
	return nil
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
	}

	err = buildImageAndRun(dir)
	if err != nil {
		fmt.Println(err)
	}

}

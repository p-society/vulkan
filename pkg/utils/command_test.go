package utils

import (
	"context"
	"os"
	"testing"
	"time"
)

// TestRunCommandSuccess tests a successful command execution.
func TestRunCommandSuccess(t *testing.T) {
	ctx := context.Background()
	err := RunCommand(ctx, true, "echo", "hello")
	if err != nil {
		t.Fatalf("expected no error, but got: %v", err)
	}
}

// TestRunCommandFailure tests a command that should fail.
func TestRunCommandFailure(t *testing.T) {
	ctx := context.Background()
	err := RunCommand(ctx, true, "false") // `false` always returns a non-zero exit status
	if err == nil {
		t.Fatal("expected an error, but got none")
	}
}

// TestRunCommandContextCancel tests if the command respects context cancellation.
func TestRunCommandContextCancel(t *testing.T) {
	ctx, cancel := context.WithCancel(context.Background())
	defer cancel()

	cmd := "sleep"
	args := []string{"10"}

	go func() {
		time.Sleep(100 * time.Millisecond) // Wait a bit and then cancel the context
		cancel()
	}()

	err := RunCommand(ctx, false, cmd, args...)
	if err == nil {
		t.Fatal("expected an error due to context cancellation, but got none")
	}
}

// TestRunCommandWithoutVerbose tests running a command without verbose output.
func TestRunCommandWithoutVerbose(t *testing.T) {
	ctx := context.Background()
	err := RunCommand(ctx, false, "echo", "quiet test")
	if err != nil {
		t.Fatalf("expected no error, but got: %v", err)
	}
}

// TestRunCommandVerboseOutput tests running a command with verbose output.
func TestRunCommandVerboseOutput(t *testing.T) {
	ctx := context.Background()

	// Temporarily redirect os.Stdout and os.Stderr
	stdout := os.Stdout
	stderr := os.Stderr
	r, w, _ := os.Pipe()
	os.Stdout = w
	os.Stderr = w

	err := RunCommand(ctx, true, "echo", "verbose test")
	if err != nil {
		t.Fatalf("expected no error, but got: %v", err)
	}

	// Restore os.Stdout and os.Stderr
	w.Close()
	os.Stdout = stdout
	os.Stderr = stderr

	// Read the output from the pipe
	output := make([]byte, 1024)
	n, _ := r.Read(output)
	r.Close()

	if n == 0 {
		t.Fatal("expected output, but got none")
	}
}

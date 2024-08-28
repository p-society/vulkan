package utils

import (
	"context"
	"os"
	"os/exec"
)

// RunCommand executes a shell command with the specified arguments in the given context.
//
// Parameters:
// - ctx (context.Context): The context to control the execution of the command. If the context is canceled or times out, the command will be terminated.
// - v (bool): A boolean flag indicating whether to set the command's output to the standard error and standard output streams of the process. If true, the command's standard output and error will be redirected to os.Stdout and os.Stderr, respectively.
// - name (string): The name of the command to run. This should be the name of an executable or script.
// - args (...string): Additional arguments to pass to the command.
//
// Returns:
// - error: An error if the command fails to execute or if there is an issue running the command.
func RunCommand(ctx context.Context, v bool, name string, args ...string) error {
	cmd := exec.CommandContext(ctx, name, args...)
	if v {
		cmd.Stderr = os.Stderr
		cmd.Stdout = os.Stdout
	}

	return cmd.Run()
}

GO = go
BUILD_DIR = cmd
OUTPUT_NAME = vulkan

build:
	$(GO) build -o $(OUTPUT_NAME) $(BUILD_DIR)/main.go 

clean:
	rm -f $(OUTPUT_NAME)

run: build
	./$(OUTPUT_NAME)

.PHONY: build clean run

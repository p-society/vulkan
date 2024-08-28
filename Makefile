GO = go
BUILD_DIR = cmd/vulkan
OUTPUT_DIR = bin
OUTPUT_NAME = vulkan

build:
	@mkdir -p $(OUTPUT_DIR)
	$(GO) build -o $(OUTPUT_DIR)/$(OUTPUT_NAME) $(BUILD_DIR)/main.go

clean:
	rm -f $(OUTPUT_DIR)/$(OUTPUT_NAME)

run: build
	./$(OUTPUT_DIR)/$(OUTPUT_NAME)

.PHONY: build clean run

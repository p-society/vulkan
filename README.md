<h1 align="center">
    Vulkan
</h1>

<h1 align="center">
    <img src="https://github.com/p-society/vulkan/raw/main/assets/vulcan.png" width="200">
</h1>

<div align="center">
    Vulkan is a dynamic system designed to test multiple variants of a particular implementation in a competitive development environment.
</div>

<div align="center">
    <h3>P-Society Handles</h3>
    <h3 align="center">
        <a href="https://dev-psoc.netlify.app/">Website</a>
        <span> | </span>
        <a href="https://discord.gg/UhmKJGMnan">Community Discord</a>
        <span> | </span>
        <a href="https://github.com/p-society/gc-server/blob/main/docs/CONTRIBUTING.md">Contribute</a>
    </h3>
</div>

----------------------------------------

<div align="center">
    <b>Vulkan</b> is a system for testing various implementations, built to facilitate comprehensive testing in a competitive development context. It is implemented using Go, MongoDB, Git and Docker.
</div>

<div align="center">
    <br/>
    <img src='https://github.com/p-society/vulkan/raw/main/assets/go.svg' width='70' height='70'>
    <img src='https://github.com/p-society/vulkan/raw/main/assets/docker.svg' width='70' height='70' style='border-radius: 10px;'>
    <img src='https://github.com/p-society/vulkan/raw/main/assets/git.svg' width='70' height='70' style='border-radius: 10px;'>
    <img src='https://github.com/p-society/vulkan/raw/main/assets/mongodb.svg' width='70' height='70' style='border-radius: 10px;'>
</div>

## Installation Guide

To get started with Vulkan, follow these steps:

### Prerequisites

Before you begin, ensure you have the following installed:

- **Go**: [Download and install Go](https://golang.org/doc/install)
- **Docker**: [Install Docker](https://docs.docker.com/get-docker/)

### Installation

1. **Clone the Repository**

   First, clone the Vulkan repository to your local machine:

   ```bash
   git clone https://github.com/p-society/vulkan.git
   cd vulkan
   ```

2. **Build the Project**

    Use `make` to build the Vulkan executable:

    ```bash
    make
    ```

3. **Run**

    Execute Vulkan with the desired GitHub repository URL:

    ```bash
    ./vulkan <github-url>
    ```
    Example:

    ```bash
    ./vulkan https://github.com/majorbruteforce/http-starter.git
    ```

### Troubleshooting

- Permission Denied for Docker: Ensure your user is added to the docker group. Refer to the [Docker documentation](https://docs.docker.com/engine/install/linux-postinstall/) for instructions on adding your user to the docker group.

- Missing Dependencies: Make sure both Go and Docker are installed and accessible from your command line. Verify installation by running go version and docker --version.


### Current contributors <a name="Current contributors"></a>

<a href="https://github.com/p-society/vulkan/graphs/contributors">
    <img src="https://contributors-img.web.app/image?repo=p-society/vulkan" />
</a>

Made with [contributors-img](https://contributors-img.web.app).

## Subscribe to updates
<center>
	
Join our [Discord Server](https://discord.gg/UhmKJGMnan) and [subscribe](https://github.com/p-society/vulkan) to this repository  to get updates, information about Vulkan
    
</center>

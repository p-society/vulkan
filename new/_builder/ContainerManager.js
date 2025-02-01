import { exec } from 'child_process';
import logger from '../_errors/ActuatorErrors.js';
import Docker from 'dockerode';

export default class ContainerManager {
    #dockerRemoteAPI

    constructor(DOCKER_SOCKET_PATH = '/var/run/docker.sock') {
        this.#checkDockerInstalled();
        this.#dockerRemoteAPI = new Docker({ socketPath: DOCKER_SOCKET_PATH });
        // this.listContainers();
        
    }

    #checkDockerInstalled() {
        exec('docker --version', (error, stdout, stderr) => {
            if (error) {
                logger.error(`Error: Docker is not installed. ${stderr}`);
            } else {
                logger.info(`Docker is installed: ${stdout}`);
            }
        });
    }

    getContainerObject(containerId) {
        return this.#dockerRemoteAPI.getContainer(containerId);
    }

    inspectContainer(containerId) {
        // query API for container info
        const container = this.getContainerObject(containerId);
        container.inspect(function (err, data) {
            console.log(data);
        });
    }

    startContainer(containerId) {
        const container = this.getContainerObject(containerId);
        container.start(function (err, data) {
            console.log(data);
        });
    }

    removeContainer(containerId) {
        const container = this.getContainerObject(containerId);
        container.remove(function (err, data) {
            console.log(data);
        });
    }

    listContainers() {
        this.#dockerRemoteAPI.listContainers(function (err, containers) {
            logger.info(containers);
        });
    }

    stopAllContainersOnHost(containerId) {
        this.#dockerRemoteAPI.listContainers(function (err, containers) {
            containers.forEach(function (containerInfo) {
                this.getContainerObject(containerId).stop(cb);
            });
        });
    }
}

new ContainerManager();
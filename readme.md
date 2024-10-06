To start the project:
`npm run dev`
To run eslint:
`npm run lint`

# DOCKER COMMAND

- Build docker image
  `docker build -t <YOUR_DOCKER_IMAGE_NAME> .`
  `docker build -t <YOUR_DOCKER_IMAGE_NAME>:<VERSION_NUMBER> .`

- Run docker container
  `docker run --env-file .env -p PORT_NUMBER:PORT_NEMBER <YOUR_DOCKER_IMAGE_NAME>`

- View list of images
  `docker images`

- Delete docker image
  `docker image rm <YOUR_DOCKER_IMAGE_NAME>`

* forcefully delete
  `docker image rm <YOUR_DOCKER_IMAGE_NAME> -f`

* Delete all the images & container
  `docker system prune -a`

* Run docker compose file
  `docker-compose --env-file=.env up`

/**
 * Contains metadata information for the Swagger documentation of the API.
 *
 * @property {string} title - The title of the application.
 * @property {string} description - A brief description of the API.
 * @property {string} docPath - The path where the API documentation can be found.
 * @property {Object} author - Information about the author of the API.
 * @property {string} author.name - The name of the author.
 * @property {string} author.email - The email address of the author.
 * @property {string} author.url - The URL to the author's website or profile.
 */
export const swaggerInfo = {
  title: 'UEK-295-Timo',
  description: 'Backend für eine TODO-App',
  docPath: 'docs',
  author: {
    name: 'von Arx Timo',
    email: 't.vonarx.inf24@stud.bbbaden.ch',
    url: '-',
  },
} as const;

import Fastify from 'fastify';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import Autoload from 'fastify-autoload'

const app = Fastify({
    logger:true
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default async function (app, opts) {
    app.register(Autoload, {
        dir: join(__dirname, "routes")
    })

    app.register(Autoload, {
        dir: join(__dirname, "plugins")
    })

    app.get('/', async function (request, reply) {
        reply.type('application/json').code(200)
        return { hello: 'world' }
    })

    app.get('/post', async (req, res) => {
        await app.prisma.user.create({
            data: {
                name: 'Alice',
                email: 'alice@prisma.io',
                posts: {
                    create: { title: 'Hello World' },
                },
                profile: {
                    create: { bio: 'I like turtles' },
                },
            },
        })
        return "Successful";
    })

    app.listen(3000, (err, address) => {
        if(err) throw err;
    })
}

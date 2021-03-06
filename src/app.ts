import createFastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { signInWithEthereum } from 'fastify-siwe'
import cors from '@fastify/cors'

const fastify = createFastify({ logger: true })

void fastify.register(cors)
void fastify.register(signInWithEthereum())

fastify.post(
  '/siwe/init',
  {},
  async function handler(
    this: FastifyInstance,
    req: FastifyRequest,
    reply,
  ) {
    void reply
    .code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      nonce: await req.siwe.generateNonce(),
    })
  },
)

fastify.get(
  '/siwe/me',
  {},
  async function handler(
    this: FastifyInstance,
    req: FastifyRequest,
    reply,
  ) {
    if (!req.siwe.session) {
      void reply.status(401).send()
      return
    }

    void reply.code(200)
    .header('Content-Type', 'application/json; charset=utf-8')
    .send({
      loggedIn: true,
      message: req.siwe.session,
    })
  },
)

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 5000, process.env.ADDRESS || '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

void start()

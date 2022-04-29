import createFastify, { FastifyInstance, FastifyRequest } from 'fastify'
import { signInWithEthereum } from 'fastify-siwe'
import cors from 'fastify-cors'

const fastify = createFastify({ logger: true })

void fastify.register(cors)
void fastify.register(signInWithEthereum())

fastify.get(
  '/',
  {},
  async function handler(
    this: FastifyInstance,
    req: FastifyRequest,
    reply,
  ) {
    void reply.send('fastify-siwe-backend')
  },
)

fastify.post(
  '/siwe/init',
  {},
  async function handler(
    this: FastifyInstance,
    req: FastifyRequest,
    reply,
  ) {
    void reply.send({
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

    void reply.code(200).send({
      loggedIn: true,
      message: req.siwe.session,
    })
  },
)

const start = async () => {
  try {
    await fastify.listen(process.env.PORT || 5000, '0.0.0.0')
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}

void start()

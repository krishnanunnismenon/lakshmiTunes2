import cors from 'cors';

const corsOptions = {
  origin: process.env.FRONT_END_URL,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: true,
};

const securityHeaders = (req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();

};
const corsConfig = [cors(corsOptions),securityHeaders];
export default corsConfig
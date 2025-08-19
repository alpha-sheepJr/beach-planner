import { Router, Request, Response } from 'express';

const router = Router(); // ← This line was missing

interface BeachParams {
  beachId: string;
}

router.get('/:beachId', (req: Request<BeachParams>, res: Response) => {
  const { beachId } = req.params;

  res.render('beachView', { beachId });
});

export default router;
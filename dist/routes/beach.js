import { Router } from 'express';
const router = Router(); // ← This line was missing
router.get('/:beachId', (req, res) => {
    const { beachId } = req.params;
    res.render('beachView', { beachId });
});
export default router;

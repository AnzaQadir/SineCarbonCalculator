import { Router } from 'express';
import { createShare, getShare } from '../controllers/shareController';

const router = Router();

router.post('/', createShare);
router.get('/:id', getShare);

export default router;



import { Request, Response } from 'express';
import { ShareContent } from '../models';

// In-memory fallback store for local/dev when DB is unavailable
type FallbackRecord = { id: string; contentType: string; payload: any; imageUrl?: string | null; createdAt: string };
const fallbackStore = new Map<string, FallbackRecord>();

export const createShare = async (req: Request, res: Response) => {
  try {
    const { contentType, payload, imageUrl, id: providedId } = req.body || {};
    if (!contentType || !payload) {
      res.status(400).json({ success: false, error: 'contentType and payload are required' });
      return;
    }
    let id: string = providedId;
    try {
      const record = await ShareContent.create({ id: providedId, contentType, payload, imageUrl });
      id = record.id || providedId;
    } catch (dbErr) {
      // Fallback to memory
      id = providedId || (await import('crypto')).randomUUID();
      fallbackStore.set(id, { id, contentType, payload, imageUrl, createdAt: new Date().toISOString() });
    }
    const publicUrlBase = process.env.PUBLIC_FRONTEND_BASE_URL || 'http://localhost:8080';
    const shareUrl = `${publicUrlBase}/share/${id}`;
    res.status(201).json({ success: true, id, url: shareUrl });
  } catch (error) {
    console.error('Error creating share:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};

export const getShare = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    let record: any = null;
    try {
      record = await ShareContent.findByPk(id);
    } catch {}
    if (!record && fallbackStore.has(id)) {
      record = fallbackStore.get(id);
    }
    if (!record) {
      res.status(404).json({ success: false, error: 'Share not found' });
      return;
    }
    res.json({ success: true, record });
  } catch (error) {
    console.error('Error fetching share:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};



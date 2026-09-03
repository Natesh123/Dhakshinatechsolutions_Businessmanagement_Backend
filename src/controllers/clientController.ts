// @ts-nocheck
import { Request, Response } from 'express';
import { Client } from '../models/Client';

export const getClients = async (req: Request, res: Response): Promise<void> => {
  try {
    const clients = await Client.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getClientById = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    res.json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.create(req.body);
    res.status(201).json({ success: true, message: 'Client created successfully', data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const updateClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    await client.update(req.body);
    res.json({ success: true, message: 'Client updated successfully', data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deleteClient = async (req: Request, res: Response): Promise<void> => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client) {
      res.status(404).json({ success: false, message: 'Client not found' });
      return;
    }
    await client.destroy();
    res.json({ success: true, message: 'Client deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

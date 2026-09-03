// @ts-nocheck
import { Request, Response } from 'express';
import { Staff } from '../models/Staff';

export const getStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findAll({
      order: [['name', 'ASC']]
    });
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const getStaffById = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    res.json({ success: true, data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const createStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.create(req.body);
    res.status(201).json({ success: true, message: 'Staff created successfully', data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const updateStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    await staff.update(req.body);
    res.json({ success: true, message: 'Staff updated successfully', data: staff });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

export const deleteStaff = async (req: Request, res: Response): Promise<void> => {
  try {
    const staff = await Staff.findByPk(req.params.id);
    if (!staff) {
      res.status(404).json({ success: false, message: 'Staff not found' });
      return;
    }
    await staff.destroy();
    res.json({ success: true, message: 'Staff deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error', errors: [error] });
  }
};

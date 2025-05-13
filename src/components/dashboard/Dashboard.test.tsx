import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import UnifiedDashboard from './Dashboard';
import { useAuth } from '@/auth/hooks/useAuth';
import React from 'react';

// Mock the useAuth hook
vi.mock('@/auth/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// Mock lazy-loaded components
vi.mock('./components/ActivityCreator', () => ({ default: () => <div>ActivityCreator</div> }));
vi.mock('./components/CategoryManager', () => ({ default: () => <div>CategoryManager</div> }));
vi.mock('./components/ContentManager', () => ({ default: () => <div>ContentManager</div> }));
vi.mock('./components/DashboardStatistics', () => ({ default: () => <div>DashboardStatistics</div> }));
vi.mock('./components/LatestActivities', () => ({ default: () => <div>LatestActivities</div> }));
vi.mock('./components/MultimediaGallery', () => ({ default: () => <div>MultimediaGallery</div> }));
vi.mock('./components/MultimediaUploadForm', () => ({ default: () => <div>MultimediaUploadForm</div> }));
vi.mock('./components/ReportViewer', () => ({ default: () => <div>ReportViewer</div> }));
vi.mock('./components/StudentProgress', () => ({ default: () => <div>StudentProgress</div> }));
vi.mock('./components/TagManager', () => ({ default: () => <div>TagManager</div> }));


describe('UnifiedDashboard', () => {
  it('renders correctly for a non-teacher user', () => {
    // Mock useAuth to return a non-teacher user
    (useAuth as jest.Mock).mockReturnValue({ user: { roles: ['student'] } });

    render(<UnifiedDashboard />);

    // Check for elements visible to all users
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Resumen')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Contenido')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Actividades')).toBeInTheDocument();
    expect(screen.getByText('Gestión Multimedia')).toBeInTheDocument();
    expect(screen.getByText('Seguimiento y Reportes')).toBeInTheDocument();

    // Check that teacher-specific elements are not present
    expect(screen.queryByText('Panel Docente')).not.toBeInTheDocument();
  });

  it('renders correctly for a teacher user', () => {
    // Mock useAuth to return a teacher user
    (useAuth as jest.Mock).mockReturnValue({ user: { roles: ['teacher'] } });

    render(<UnifiedDashboard />);

    // Check for elements visible to teachers
    expect(screen.getByText('Panel Docente')).toBeInTheDocument();
    expect(screen.getByText('Resumen')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Contenido')).toBeInTheDocument();
    expect(screen.getByText('Gestión de Actividades')).toBeInTheDocument();
    expect(screen.getByText('Gestión Multimedia')).toBeInTheDocument();
    expect(screen.getByText('Seguimiento y Reportes')).toBeInTheDocument();

    // Check that non-teacher specific elements are not present
    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
  });

  it('switches between tabs correctly', async () => {
    // Mock useAuth to return a teacher user (tabs are visible for both, but teacher has more tabs)
    (useAuth as jest.Mock).mockReturnValue({ user: { roles: ['teacher'] } });

    render(<UnifiedDashboard />);

    // Initially, the "Resumen" tab should be active and its content visible
    expect(screen.getByText('Resumen')).toBeInTheDocument();
    expect(screen.getByText('DashboardStatistics')).toBeInTheDocument();

    // Click on "Gestión de Contenido" tab
    const contentTab = await screen.findByText('Gestión de Contenido');
    await contentTab.click();
    expect(screen.getByText('ContentManager')).toBeInTheDocument();
    expect(screen.queryByText('DashboardStatistics')).not.toBeInTheDocument(); // Ensure previous tab content is hidden

    // Click on "Gestión de Actividades" tab
    const activitiesTab = await screen.findByText('Gestión de Actividades');
    await activitiesTab.click();
    expect(screen.getByText('ActivityCreator')).toBeInTheDocument();
    expect(screen.queryByText('ContentManager')).not.toBeInTheDocument();

    // Click on "Gestión Multimedia" tab
    const multimediaTab = await screen.findByText('Gestión Multimedia');
    await multimediaTab.click();
    expect(screen.getByText('MultimediaGallery')).toBeInTheDocument();
    expect(screen.queryByText('ActivityCreator')).not.toBeInTheDocument();

    // Click on "Seguimiento y Reportes" tab
    const reportsTab = await screen.findByText('Seguimiento y Reportes');
    await reportsTab.click();
    expect(screen.getByText('ReportViewer')).toBeInTheDocument();
    expect(screen.queryByText('MultimediaGallery')).not.toBeInTheDocument();

    // Click on "Gestión de Categorías" tab (Teacher only)
    const categoriesTab = await screen.findByText('Gestión de Categorías');
    await categoriesTab.click();
    expect(screen.getByText('CategoryManager')).toBeInTheDocument();
    expect(screen.queryByText('ReportViewer')).not.toBeInTheDocument();

    // Click on "Gestión de Etiquetas" tab (Teacher only)
    const tagsTab = await screen.findByText('Gestión de Etiquetas');
    await tagsTab.click();
    expect(screen.getByText('TagManager')).toBeInTheDocument();
    expect(screen.queryByText('CategoryManager')).not.toBeInTheDocument();

    // Click back to "Resumen" tab
    const summaryTab = await screen.findByText('Resumen');
    await summaryTab.click();
    expect(screen.getByText('DashboardStatistics')).toBeInTheDocument();
    expect(screen.queryByText('TagManager')).not.toBeInTheDocument();
  });
});
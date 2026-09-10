import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import NotificationBell from './NotificationBell';

jest.mock('axios');

const NOTIFICATIONS = [
    { id: 1, title: 'New quote received', message: 'You got a quote', read: false },
    { id: 2, title: 'Shipment delivered', message: 'Your shipment arrived', read: true },
];

beforeEach(() => {
    axios.get.mockImplementation((url) => {
        if (url.includes('/api/notifications/unread-count')) {
            return Promise.resolve({ data: { unread_count: 1 } });
        }
        if (url.includes('/api/notifications')) {
            return Promise.resolve({ data: NOTIFICATIONS });
        }
        return Promise.resolve({ data: [] });
    });
    axios.put.mockResolvedValue({ data: {} });
});

afterEach(() => {
    jest.clearAllMocks();
});

test('shows the unread count badge from the API', async () => {
    render(<NotificationBell />);
    expect(await screen.findByText('1')).toBeInTheDocument();
});

test('opens the dropdown and lists notifications on click', async () => {
    render(<NotificationBell />);
    await screen.findByText('1');

    fireEvent.click(screen.getByLabelText('Notifications'));

    expect(await screen.findByText('New quote received')).toBeInTheDocument();
    expect(screen.getByText('Shipment delivered')).toBeInTheDocument();
});

test('clicking an unread notification marks it as read and decrements the badge', async () => {
    render(<NotificationBell />);
    await screen.findByText('1');
    fireEvent.click(screen.getByLabelText('Notifications'));
    await screen.findByText('New quote received');

    fireEvent.click(screen.getByText('New quote received'));

    await waitFor(() => expect(screen.queryByText('1')).not.toBeInTheDocument());
    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/api/notifications/1/read'));
});

test('"Mark all as read" clears the unread badge', async () => {
    render(<NotificationBell />);
    await screen.findByText('1');
    fireEvent.click(screen.getByLabelText('Notifications'));
    await screen.findByText('New quote received');

    fireEvent.click(screen.getByText('Mark all as read'));

    await waitFor(() => expect(screen.queryByText('1')).not.toBeInTheDocument());
    expect(axios.put).toHaveBeenCalledWith(expect.stringContaining('/api/notifications/read-all'));
});

test('shows an empty state when there are no notifications', async () => {
    axios.get.mockImplementation((url) => {
        if (url.includes('/api/notifications/unread-count')) {
            return Promise.resolve({ data: { unread_count: 0 } });
        }
        if (url.includes('/api/notifications')) {
            return Promise.resolve({ data: [] });
        }
        return Promise.resolve({ data: [] });
    });

    render(<NotificationBell />);
    fireEvent.click(screen.getByLabelText('Notifications'));

    expect(await screen.findByText('No notifications yet')).toBeInTheDocument();
});

test('panel is fixed to the viewport edge and spans full height regardless of notification count', async () => {
    axios.get.mockImplementation((url) => {
        if (url.includes('/api/notifications/unread-count')) {
            return Promise.resolve({ data: { unread_count: 0 } });
        }
        if (url.includes('/api/notifications')) {
            return Promise.resolve({ data: [] });
        }
        return Promise.resolve({ data: [] });
    });

    render(<NotificationBell />);
    fireEvent.click(screen.getByLabelText('Notifications'));
    await screen.findByText('No notifications yet');

    const panel = screen.getByTestId('notification-panel');
    expect(panel).toHaveClass('fixed', 'inset-y-0', 'right-0');
    expect(panel.className).not.toMatch(/max-h-/);
});

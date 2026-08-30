import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import axios from 'axios';
import Profile from './Profile';

jest.mock('axios');

const mockUpdateUser = jest.fn();
const mockShowError = jest.fn();
const mockShowSuccess = jest.fn();

jest.mock('../context/AuthContext', () => ({
    useAuth: () => ({ user: { id: 1, name: 'Jane Traveler', role: 'traveler' }, updateUser: mockUpdateUser }),
}));

jest.mock('../context/SnackbarContext', () => ({
    useSnackbar: () => ({ success: mockShowSuccess, error: mockShowError, warn: jest.fn(), info: jest.fn() }),
}));

const PROFILE = {
    name: 'Jane Traveler',
    email: 'jane@example.com',
    role: 'traveler',
    country_code: '+1',
    mobile_number: '5550100',
    profile_picture: null,
};

beforeEach(() => {
    axios.get.mockResolvedValue({ data: PROFILE });
});

afterEach(() => {
    jest.clearAllMocks();
});

const renderProfile = async () => {
    render(<Profile />);
    await screen.findByDisplayValue('Jane Traveler');
};

test('loads and displays the current profile fields', async () => {
    await renderProfile();

    expect(screen.getByLabelText('Name')).toHaveValue('Jane Traveler');
    expect(screen.getByLabelText('Email')).toHaveValue('jane@example.com');
    expect(screen.getByLabelText('Email')).toBeDisabled();
    expect(screen.getByLabelText('Country Code')).toHaveValue('+1');
    expect(screen.getByLabelText('Mobile Number')).toHaveValue('5550100');
    expect(screen.getByLabelText('I am a...')).toHaveValue('traveler');
});

test('submits the edited name, contact details, and role', async () => {
    axios.put.mockResolvedValue({ data: { ...PROFILE, name: 'Jane Both', role: 'both', mobile_number: '5550199' } });
    await renderProfile();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Jane Both' } });
    fireEvent.change(screen.getByLabelText('Mobile Number'), { target: { value: '5550199' } });
    fireEvent.change(screen.getByLabelText('I am a...'), { target: { value: 'both' } });
    fireEvent.click(screen.getByText('Save Changes'));

    await waitFor(() => expect(axios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/users/profile'),
        expect.objectContaining({ name: 'Jane Both', mobile_number: '5550199', role: 'both' })
    ));
    expect(mockUpdateUser).toHaveBeenCalledWith({ name: 'Jane Both', role: 'both', profile_picture: null });
    expect(mockShowSuccess).toHaveBeenCalledWith('Profile updated');
});

test('blocks submission when the name is cleared', async () => {
    await renderProfile();

    fireEvent.change(screen.getByLabelText('Name'), { target: { value: '   ' } });
    fireEvent.click(screen.getByText('Save Changes'));

    expect(screen.getByText('Name cannot be empty')).toBeInTheDocument();
    expect(axios.put).not.toHaveBeenCalled();
});

test('shows an error message when the update request fails', async () => {
    axios.put.mockRejectedValue({ response: { data: { error: 'Mobile number already in use' } } });
    await renderProfile();

    fireEvent.click(screen.getByText('Save Changes'));

    expect(await screen.findByText('Mobile number already in use')).toBeInTheDocument();
    expect(mockUpdateUser).not.toHaveBeenCalled();
});

test('shows initials when there is no profile picture', async () => {
    await renderProfile();

    expect(screen.getByText('JT')).toBeInTheDocument();
});

test('uploads a valid profile picture and previews it', async () => {
    axios.post.mockResolvedValue({ data: { profile_url: 'https://cdn.example.com/profile/avatar.png' } });
    await renderProfile();

    const file = new File(['image-bytes'], 'avatar.png', { type: 'image/png' });
    fireEvent.change(screen.getByLabelText('Change photo'), { target: { files: [file] } });

    await waitFor(() => expect(axios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/upload'),
        expect.any(FormData),
        expect.objectContaining({ headers: { 'Content-Type': 'multipart/form-data' } })
    ));
    expect(await screen.findByAltText('Profile')).toHaveAttribute('src', 'https://cdn.example.com/profile/avatar.png');
});

test('rejects a profile picture with a disallowed file type', async () => {
    await renderProfile();

    const file = new File(['pdf-bytes'], 'resume.pdf', { type: 'application/pdf' });
    fireEvent.change(screen.getByLabelText('Change photo'), { target: { files: [file] } });

    expect(await screen.findByText(/must be a JPEG, PNG, GIF, or WEBP image/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
});

test('rejects a profile picture that is too large', async () => {
    await renderProfile();

    const file = new File(['image-bytes'], 'avatar.png', { type: 'image/png' });
    Object.defineProperty(file, 'size', { value: 6 * 1024 * 1024 });
    fireEvent.change(screen.getByLabelText('Change photo'), { target: { files: [file] } });

    expect(await screen.findByText(/must be smaller than 5MB/i)).toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
});

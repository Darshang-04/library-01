'use client';
import { useState } from 'react';
import AdminLayout from './layout';
import Lottie from 'lottie-react';
import booknotewithpen from "./../../../../../../public/booknotewithpen.json";


export default function AdminAddMember() {
    const [emails, setEmails] = useState('');
    const [isStaff, setIsStaff] = useState(false); // Track if the role is staff
    const [responseMessage, setResponseMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setResponseMessage('');

        // Split emails by comma and trim any whitespace
        const emailArray = emails.split(',').map((email) => email.trim());

        // Validate email addresses
        const invalidEmails = emailArray.filter((email) => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
        if (invalidEmails.length > 0) {
            setResponseMessage(`Invalid email(s): ${invalidEmails.join(', ')}`);
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${backendUrl}/api/addmember`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emails: emailArray, role: isStaff ? 'staff' : 'user' }), // Include the role
            });

            const result = await response.json();
            if (result.results) {
                const successEmails = result.results.filter(r => r.status === 'Success').map(r => r.email).join(', ');
                const failedEmails = result.results.filter(r => r.status === 'Failed').map(r => `${r.email} (${r.message})`).join(', ');
                setResponseMessage(`
                    Success: ${successEmails || 'None'}
                    Failed: ${failedEmails || 'None'}
                `);
            } else {
                setResponseMessage(result.msg || result.error);
            }
              
        } catch (error) {
            console.error('Error:', error);
            setResponseMessage('Error: Unable to send emails.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: 'auto', padding: '20px' }}>
            <h1>Add Members</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="emails">Recipient Emails (comma-separated):</label>
                <textarea
                    id="emails"
                    name="emails"
                    value={emails}
                    onChange={(e) => setEmails(e.target.value)}
                    required
                    placeholder="Enter email addresses separated by commas"
                    style={{ padding: '10px', width: '100%', marginBottom: '10px', height: '80px' }}
                />
                <div style={{ marginBottom: '10px' }}>
                    <label>
                        <input
                            type="checkbox"
                            checked={isStaff}
                            onChange={(e) => setIsStaff(e.target.checked)}
                        />{' '}
                        Assign as Staff
                    </label>
                </div>
                <button
                    type="submit"
                    style={{ padding: '10px', width: '100%', cursor: loading ? 'not-allowed' : 'pointer' }}
                    disabled={loading}
                >
                    {loading ? 'Processing...' : 'Send Emails'}
                </button>
            </form>
            {loading && (
                <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
                    <div>
                        <Lottie
                        animationData={booknotewithpen}
                        loop={true}
                        style={{ width: '100px', height: '100px' }} 
                        />
                    </div>
                </div>
            )}
            {responseMessage && <p>{responseMessage}</p>}

        </div>
    );
}

AdminAddMember.getLayout = function getLayout(page) {
    return <AdminLayout>{page}</AdminLayout>;
};

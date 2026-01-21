import { useState, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { submitContact } from "../api";

const cardStyle = {
    backgroundColor: 'white',
    border: '1px solid var(--border)',
    borderRadius: '1rem',
    padding: '1.5rem',
};

const inputStyle = {
    width: '100%',
    padding: '0.75rem 1rem',
    borderRadius: '0.75rem',
    border: '1px solid var(--border)',
    backgroundColor: 'white',
    color: 'var(--text-primary)',
    outline: 'none',
};

export default function ContactForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        message: "",
    });
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState(null);
    const formRef = useRef(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        // Clear error when user starts typing
        if (error) setError(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
            setError("Please fill in all fields");
            return;
        }

        setLoading(true);

        try {
            await submitContact(formData);
            setSubmitted(true);
            setFormData({ name: "", email: "", message: "" });
            setTimeout(() => setSubmitted(false), 5000);
        } catch (err) {
            console.error("Error sending message:", err);
            setError(err.message || "Error sending message. Please try contacting directly.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={cardStyle}>
            <h3
                className="text-lg font-semibold mb-4"
                style={{ color: 'var(--text-primary)' }}
            >
                Send Me a Message
            </h3>

            {/* Error message */}
            {error && (
                <div
                    className="mb-4 rounded-lg p-3"
                    style={{
                        backgroundColor: '#FEF2F2',
                        border: '1px solid #FECACA',
                    }}
                >
                    <p className="text-sm" style={{ color: '#DC2626' }}>{error}</p>
                </div>
            )}

            {submitted ? (
                <div
                    className="rounded-lg p-4"
                    style={{
                        backgroundColor: '#F0FDF4',
                        border: '1px solid #BBF7D0',
                    }}
                >
                    <p className="text-sm font-medium" style={{ color: '#16A34A' }}>
                        Thanks for reaching out! I'll get back to you soon.
                    </p>
                </div>
            ) : (
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-3">
                    <div>
                        <label
                            htmlFor="name"
                            className="block text-sm font-medium mb-1"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Your name"
                            style={inputStyle}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium mb-1"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="your.email@example.com"
                            style={inputStyle}
                            disabled={loading}
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="message"
                            className="block text-sm font-medium mb-1"
                            style={{ color: 'var(--text-secondary)' }}
                        >
                            Message
                        </label>
                        <textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            placeholder="Your message..."
                            rows="4"
                            style={{ ...inputStyle, resize: 'none' }}
                            disabled={loading}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full font-medium py-2.5 px-4 rounded-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                        style={{
                            backgroundColor: 'var(--accent)',
                            color: 'white',
                        }}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Send Message
                            </>
                        )}
                    </button>
                </form>
            )}
        </div>
    );
}

'use client'
import { Mail } from "lucide-react";
import { useRef, useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { toast } from "sonner";


const sitekey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
const ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN
export default function ForgotPage(){
    const recaptchaRef = useRef<ReCAPTCHA>(null);
    const [isVerified, setIsVerified] = useState(false);
    const [token, setToken] = useState('');
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Whitelist specific email addresses
        const whitelistedEmails = ["ananyk24@iitk.ac.in"];
        
        if (!whitelistedEmails.includes(email) && !email.endsWith('@iitk.ac.in')) {
         toast.error('Only IITK email address is allowed.');
        return;
        }

        try {
            setLoading(true);
            const res = await fetch(`${ORIGIN}/auth/forgot-password`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email, token}),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.message || "Failed to send reset link.");
                return;
            }
            toast.success("Reset link sent successfully.");
            setEmail('');
            recaptchaRef.current?.reset();
            setIsVerified(false);

        }

        catch (err) {
            console.error(err);
            toast.error("Server error. Please try again later.");
        }
        finally{
            setLoading(false);
        }

    }

    const handleChange = (token: string | null) => {
        setToken(token || '');
        setIsVerified(true);

        
    }

    function handleExpired () {
        setIsVerified(false);
    }
    return (
        <div className="flex items-center justify-center fixed inset-0 bg-background dark:bg-black">
           <form className="w-[80%] mb:w-full max-w-md p-4 md:p-8 rounded-2xl shadow-xl backdrop-blur-lg border border-gray-300 dark:border-gray-800 bg-gray-100 dark:bg-gray-900 space-y-6 animate-in fade-in duration-700 transition-colors" onSubmit={handleSubmit}><h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
          Reset Password
        </h2>
        <div>
            <label className="text-sm font-medium block mb-1 text-gray-800 dark:text-gray-300">Email</label>
            <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"/>
                <input type="email" name="email" required className="w-full pl-10 pr-4 py-2 rounded-lg bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none text-black dark:text-white placeholder-gray-500 dark:placeholder-gray-400" placeholder="Enter your Email" value={email} onChange={(e) => setEmail(e.target.value)}/>
            </div>
        </div>
            <div className="flex justify-center">
                <div className="recaptcha-wrapper">
                    <ReCAPTCHA
                    sitekey={sitekey || ""}
                    ref={recaptchaRef}
                    onChange={handleChange}
                    onExpired={handleExpired}
                    />
                </div>
            </div>
        
        <button type="submit" disabled={!isVerified || loading} className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-white disabled:opacity-50 disabled:cursor-not-allowed" >{!loading ? "Send Reset Link" : "Loading..."}</button>
        </form>
        </div>
    )
}
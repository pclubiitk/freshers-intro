'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const BACKEND_ORIGIN = process.env.NEXT_PUBLIC_BACKEND_ORIGIN;

export default function ProfileFormPage() {
    const router = useRouter();

    const [bio, setBio] = useState('');
    const [branch, setBranch] = useState('');
    const [batch, setBatch] = useState('');
    const [hostel, setHostel] = useState('');
    const [hobbies, setHobbies] = useState<string[]>([]);
    const [interests, setInterests] = useState<string[]>([]);
    const [imageFiles, setImageFiles] = useState<File[]>([]);

    const [hobbyInput, setHobbyInput] = useState('');
    const [interestInput, setInterestInput] = useState('');

    // Utility to add a new string to a list
    const addToList = (input: string, setList: any, list: string[], type: string) => {
        const trimmed = input.trim();
        if (!trimmed) return;
        if (list.includes(trimmed)) {
        toast.error(`${type} already added`);
        return;
        }
        setList([...list, trimmed]);
        toast.success(`${type} added`);
    };

    const handleImageUpload = async () => {
        const keys: string[] = [];

        for (const file of imageFiles) {
            try {
                const presignRes = await fetch(`${BACKEND_ORIGIN}/s3/presign?filename=${file.name}`, {
                credentials: 'include',
                });
                const { upload_url, fields, key } = await presignRes.json();

                const formData = new FormData();
                Object.entries(fields).forEach(([k, v]) => formData.append(k, v as string));
                formData.append('file', file);

                const upload = await fetch(upload_url, {
                method: 'POST',
                body: formData,
                });

                if (!upload.ok) throw new Error(`Upload failed for ${file.name}`);
                keys.push(key);
                toast.success(`${file.name} uploaded`);
            } catch (err) {
                toast.error(`Error uploading ${file.name}`);
                console.error(`Error uploading ${file.name}`,err)
            }
        }

        return keys;
    };

    const handleSubmit = async () => {
        try {
        const uploadedKeys = await handleImageUpload();

        const body = {
            bio,
            branch,
            batch,
            hostel,
            hobbies,
            interests,
            image_keys: uploadedKeys,
        };

        const res = await fetch(`${BACKEND_ORIGIN}/profile/create-or-update-profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify(body),
        });

        if (!res.ok) {
            const errText = await res.text();
            throw new Error(errText);
        }

        toast.success('Profile submitted');
        router.push('/dashboard');
        } catch (error) {
        toast.error(`Submission failed: ${error}`);
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">Complete Your Profile</h1>
        <Card>
            <CardContent className="p-6 space-y-4">
            <Label>Bio</Label>
            <Textarea value={bio} onChange={e => setBio(e.target.value)} />

            <Label>Branch</Label>
            <Input value={branch} onChange={e => setBranch(e.target.value)} />

            <Label>Batch</Label>
            <Input value={batch} onChange={e => setBatch(e.target.value)} />

            <Label>Hostel</Label>
            <Input value={hostel} onChange={e => setHostel(e.target.value)} />

            <div>
                <Label>Hobbies</Label>
                <div className="flex gap-2 mt-1">
                <Input
                    placeholder="Add hobby"
                    value={hobbyInput}
                    onChange={e => setHobbyInput(e.target.value)}
                />
                <Button type="button" onClick={() => {
                    addToList(hobbyInput, setHobbies, hobbies, 'Hobby');
                    setHobbyInput('');
                }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                {hobbies.map((hobby, idx) => (
                    <Badge key={idx} variant="outline">{hobby}</Badge>
                ))}
                </div>
            </div>

            <div>
                <Label>Interests</Label>
                <div className="flex gap-2 mt-1">
                <Input
                    placeholder="Add interest"
                    value={interestInput}
                    onChange={e => setInterestInput(e.target.value)}
                />
                <Button type="button" onClick={() => {
                    addToList(interestInput, setInterests, interests, 'Interest');
                    setInterestInput('');
                }}>Add</Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((item, idx) => (
                    <Badge key={idx} variant="outline">{item}</Badge>
                ))}
                </div>
            </div>

            <div>
                <Label>Upload Images (max 5)</Label>
                <Input
                type="file"
                accept="image/*"
                multiple
                onChange={e => setImageFiles(Array.from(e.target.files || []).slice(0, 5))}
                />
            </div>

            <Button className="w-full mt-4" onClick={handleSubmit}>
                Submit Profile
            </Button>
            </CardContent>
        </Card>
        </div>
    );
}

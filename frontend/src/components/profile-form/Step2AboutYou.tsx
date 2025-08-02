import { User_Profile_Form } from "@/utils/types";
import { Dispatch, SetStateAction } from "react";
import InterestTag from "../InterestTag";
import { Common_Interests } from "@/utils/constants";

interface Step2AboutYouProps {
    formData: User_Profile_Form;
    handleInputChange: (name: keyof User_Profile_Form, value: any) => void;
    setFormData: Dispatch<SetStateAction<User_Profile_Form>>;
    customInterest: string;
    setCustomInterest: Dispatch<SetStateAction<string>>;
    submitError: string;
    setSubmitError: Dispatch<SetStateAction<string>>;
}




export default function Step_2_AboutYou(
    {
        formData, handleInputChange, setFormData, customInterest, setCustomInterest, submitError, setSubmitError
    }: Step2AboutYouProps
) {


    const handleInterestRemove = (intrestToRemove:string) => {
        const newIntrestsArray = formData?.interests.filter(intrest => intrest !== intrestToRemove)
        setFormData({...formData,interests:newIntrestsArray})
        console.log(submitError)
    }

    const handleInterestAdd = (newInterest:string) => {
        setSubmitError("")
        if(newInterest===""){
            setSubmitError("why are you trying to add empty interest?")
            return ;
        }else if(newInterest.length>20){
            setSubmitError("Interest length should not exceed 20 characters")
            return ;
        }
        if([...formData?.interests].map((interest)=>{return interest.toLowerCase()}).includes(newInterest.toLowerCase())){
            setSubmitError("why are you trying to add same interest again and again?")
            return ;
        }

        const newIntrestsArray = [...formData?.interests,newInterest]
        setFormData({...formData,interests:newIntrestsArray})
        sessionStorage.setItem("updated_profile",JSON.stringify({...formData,interests:newIntrestsArray}))
    }



    return (
        <div className="space-y-6">
            <h3 className={`text-xl font-semibold`}>
                About You
            </h3>
            <textarea
                name="bio"
                value={formData?.bio}
                onChange={(e) => handleInputChange("bio", e.target.value)}
                placeholder="Tell us about yourself"
                className={`w-full p-2 h-40 border rounded`}
            />

            <h3 className={`text-xl font-semibold`}>
                Your Interests
            </h3>
            <div className="flex flex-wrap gap-2 mb-2">
                {formData?.interests.map((interest,i) => (
                    <InterestTag
                        key={interest+i}
                        text={interest}
                        onRemove={() => handleInterestRemove(interest)}
                        removable
                    />
                ))}
            </div>
            <div className="flex flex-wrap gap-2">
                {Common_Interests.map((interest,i) => (
                    <InterestTag
                        key={interest+i}
                        text={interest}
                        onClick={() => handleInterestAdd(interest)}
                        disabled={
                            formData?.interests.includes(interest) ||
                            formData?.interests.length >= 5
                        }
                    />
                ))}
            </div>
            <div className="flex mt-4 gap-2">
                <input
                    type="text"
                    value={customInterest}
                    onChange={(e) =>
                        {
                            setCustomInterest(e.target.value)
                        }
                    }
                    maxLength={20}
                    className={`flex-1 p-2 border rounded`}
                    placeholder="Add custom interest"
                />
                <p className="text-xs text-gray-500 mt-1">{customInterest.length || 0}/20</p>
                <button
                    type="button"
                    onClick={() => {
                        handleInterestAdd(customInterest)
                        console.log()
                    }}
                    disabled={!customInterest?.trim() || formData?.interests.length >= 5}
                    className={`px-4 py-2 text-white rounded  dark:bg-pink-600 dark:hover:bg-pink-700 bg-pink-500 hover:bg-pink-600`}
                >
                    Add
                </button>
            </div>
        </div>
    )
}
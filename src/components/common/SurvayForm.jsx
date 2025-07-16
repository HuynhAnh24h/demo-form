import survay from "@/constant/survay.json"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"

// ✅ Tạo schema xác thực từ danh sách câu hỏi
const schema = z.object(
    Object.fromEntries(
        survay.flatMap((step) =>
            step.questions.map((q) => {
                const key = q.id.toString()

                // Kiểm tra riêng số điện thoại
                if (q.type === "phone") {
                    return [
                        key,
                        z.string().regex(/^(0|\+84)\d{9}$/, {
                            message: "Số điện thoại không hợp lệ. Vui lòng nhập đúng định dạng Việt Nam.",
                        }),
                    ]
                }
                // Các trường khác
                return [
                    key,
                    q.typeOfQuestion === 1
                        ? z.string().min(1, { message: "Bạn phải chọn một đáp án" })
                        : z.string().min(1, { message: "Không được để trống câu trả lời" }),
                ]
            })
        )
    )
)

const SurveyForm = () => {
    const [step, setStep] = useState(0)
    const currentStep = survay[step]

    // Lấy dữ liệu đã lưu từ localStorage
    const saved = localStorage.getItem("surveyAnswers")
    const defaultValues = saved ? JSON.parse(saved) : {}

    const {
        register,
        handleSubmit,
        setValue,
        trigger,
        watch,
        formState: { errors },
        reset
    } = useForm({
        resolver: zodResolver(schema),
        defaultValues,
    })

    const answers = watch()

    // Tự lưu dữ liệu khi thay đổi
    useEffect(() => {
        localStorage.setItem("surveyAnswers", JSON.stringify(answers))
    }, [answers])

    // Gửi khảo sát
    const onSubmit = (data) => {
        const formatted = Object.entries(data).map(([id, answer]) => ({
            questionId: id,
            answer: answer,
        }))

        console.log("📦 Dữ liệu khảo sát gửi đi:", formatted)

        toast.success("Gửi thành công! F12 kiểm tra dữ liệu nếu cần 😄", {
            onClose: () => {
                localStorage.removeItem("surveyAnswers")
                reset({})
                setStep(0) // Quay lại bước đầu tiên
            },
            autoClose: 3000, // Đợi 3s rồi tự đóng
        })
    }


    // Kiểm tra hợp lệ trước khi chuyển bước
    const handleNextStep = async () => {
        const fieldsToValidate = currentStep.questions.map((q) => q.id.toString())
        const valid = await trigger(fieldsToValidate)

        if (valid) {
            setStep(step + 1)
        }
    }

    return (
        <div className="max-w-md md:min-w-xl shadow-xl">
            <form className="p-6 space-y-6 max-w-xl mx-auto" onSubmit={handleSubmit(onSubmit)}>
                <h2 className="text-2xl font-bold">{currentStep.categoryName}</h2>

                {currentStep.questions.map((q) => (
                    <div key={q.id} className="space-y-2">
                        <Label className="block font-medium">{q.title}</Label>

                        {q.typeOfQuestion === 1 ? (
                            <RadioGroup
                                value={answers[q.id] || ""}
                                onValueChange={(val) =>
                                    setValue(q.id.toString(), val, { shouldValidate: true })
                                }
                            >
                                {q.answers.map((a) => (
                                    <div key={a.numberOrder} className="flex items-center space-x-2">
                                        <RadioGroupItem value={a.answer} id={`${q.id}-${a.numberOrder}`} />
                                        <Label htmlFor={`${q.id}-${a.numberOrder}`}>{a.answer}</Label>
                                    </div>
                                ))}
                            </RadioGroup>
                        ) : (
                            <Input
                                type="text"
                                {...register(q.id.toString())}
                            />
                        )}

                        {errors[q.id] && (
                            <p className="text-sm text-red-500">{errors[q.id].message}</p>
                        )}
                    </div>
                ))}

                <div className="flex justify-between pt-6">
                    {step > 0 && (
                        <Button
                            variant="outline"
                            type="button"
                            onClick={() => setStep(step - 1)}
                        >
                            Quay lại
                        </Button>
                    )}
                    {step < survay.length - 1 ? (
                        <Button type="button" onClick={handleNextStep}>
                            Tiếp theo
                        </Button>
                    ) : (
                        <Button type="submit">Gửi khảo sát</Button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default SurveyForm

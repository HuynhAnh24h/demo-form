import { useState, useEffect } from "react"
import survay from "@/constant/survay.json"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "react-toastify"
import logo from "@/assets/logo.png"

// ✅ Tạo schema validation bằng zod
const schema = z.object(
  Object.fromEntries(
    survay.flatMap(step =>
      step.questions.map(q => {
        const key = q.id.toString()
        if (q.type === "phone") {
          return [
            key,
            z.string().regex(/^(0|\+84)\d{9}$/, {
              message: "Số điện thoại không hợp lệ. Nhập đúng định dạng Việt Nam.",
            }),
          ]
        }
        return [
          key,
          z.string().min(1, {
            message:
              q.typeOfQuestion === 1
                ? "Bạn phải chọn một đáp án"
                : "Không được để trống câu trả lời",
          }),
        ]
      })
    )
  )
)

function SurveyForm() {
  const [step, setStep] = useState(0)
  const currentStep = survay[step]
  const saved = localStorage.getItem("surveyAnswers")
  const defaultValues = saved ? JSON.parse(saved) : {}

  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  })

  const answers = watch()

  useEffect(() => {
    localStorage.setItem("surveyAnswers", JSON.stringify(answers))
  }, [answers])

  const onSubmit = (data) => {
    const formatted = Object.entries(data).map(([id, answer]) => ({
      questionId: id,
      answer,
    }))

    toast.success("Đã gửi khảo sát thành công! 🎉", {
      autoClose: 3000,
      onClose: () => {
        localStorage.removeItem("surveyAnswers")
        reset({})
        setStep(0)
      },
    })

    console.log("📦 Dữ liệu gửi lên server:", formatted)
  }

  const handleNextStep = async () => {
    const fields = currentStep.questions.map(q => q.id.toString())
    const isValid = await trigger(fields)
    if (isValid) setStep(prev => prev + 1)
  }

  return (
    <div className="max-w-md md:min-w-xl shadow-xl flex flex-col justify-center items-center mx-3 bg-white p-6 rounded-lg">
      <img src={logo} alt="Logo ChanChan" className="w-28 h-28 mb-4" />

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 w-full">
        <h2 className="text-lg font-bold bg-[#FF6600] text-white text-center py-3 rounded-md shadow">
          {currentStep.categoryName}
        </h2>

        {currentStep.questions.map(q => (
          <div key={q.id} className="space-y-2">
            <Label className="text-orange-500 font-semibold block">{q.title}</Label>

            {q.typeOfQuestion === 1 && q.answers ? (
              <RadioGroup
                value={answers[q.id] ?? ""}
                onValueChange={val =>
                  setValue(q.id.toString(), val, { shouldValidate: true })
                }
              >
                {q.answers.map((a, idx) => {
                  const inputId = `${q.id}-${idx}`
                  return (
                    <div key={inputId} className="flex items-center space-x-2 hover:bg-orange-50 p-1 rounded">
                      <RadioGroupItem value={a.answer} id={inputId} />
                      <Label htmlFor={inputId}>{a.answer}</Label>
                    </div>
                  )
                })}
              </RadioGroup>
            ) : (
              <Input
                {...register(q.id.toString())}
                className="w-full border p-2 rounded text-sm font-medium outline-none focus:border-orange-500 focus:bg-orange-50 focus:text-orange-600"
              />
            )}

            {errors[q.id] && (
              <p className="text-sm text-red-500">{errors[q.id]?.message}</p>
            )}
          </div>
        ))}

        <div className="flex justify-between pt-4">
          {step > 0 && (
            <Button type="button" onClick={() => setStep(step - 1)} className="bg-orange-500 hover:bg-orange-600 text-white">
              Quay lại
            </Button>
          )}
          {step < survay.length - 1 ? (
            <Button type="button" onClick={handleNextStep} className="bg-orange-500 hover:bg-orange-600 text-white">
              Tiếp theo
            </Button>
          ) : (
            <Button type="submit" className="bg-green-500 hover:bg-green-600 text-white">
              Gửi khảo sát
            </Button>
          )}
        </div>
      </form>
    </div>
  )
}

export default SurveyForm

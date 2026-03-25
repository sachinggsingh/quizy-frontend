'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type GeneratedQuiz = {
  title: string
  points: number
  questions: Array<{
    text: string
    options: string[]
    answer: number
  }>
}

export default function QuizForm({ onPublish }: { onPublish?: (quiz: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    points: 100,
    numQuestions: 5,
  })

  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [generatedQuiz, setGeneratedQuiz] = useState<GeneratedQuiz | null>(null)

  const backendBaseUrl = useMemo(() => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080'
    return backendUrl.replace(/\/$/, '')
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'points' || name === 'numQuestions' ? Number(value) : value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'numQuestions' ? Number(value) : value,
    }))
  }

  const canGenerate = !!(
    formData.title &&
    formData.description &&
    formData.category &&
    formData.difficulty &&
    formData.numQuestions > 0 &&
    !isGenerating
  )

  const handleGenerateQuiz = async (e: React.FormEvent) => {
    e.preventDefault()
    setGenerationError(null)
    setGeneratedQuiz(null)

    if (!canGenerate) return

    try {
      setIsGenerating(true)
      const res = await fetch(`${backendBaseUrl}/quizzes/generate`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          category: formData.category,
          difficulty: formData.difficulty,
          description: formData.description,
          num_questions: formData.numQuestions,
          points: formData.points,
        }),
      })

      if (!res.ok) {
        const text = await res.text().catch(() => '')
        setGenerationError(text || 'Failed to generate quiz. Please try again.')
        return
      }

      const quiz = (await res.json()) as GeneratedQuiz
      setGeneratedQuiz(quiz)
    } catch {
      setGenerationError('Network error while generating quiz. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handlePublish = () => {
    if (!generatedQuiz) return
    onPublish?.(generatedQuiz)
  }

  return (
    <div className="bg-transparent">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-primary/20 bg-background/80 backdrop-blur-sm">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="text-center text-3xl font-bold">Create Quiz</CardTitle>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Enter your quiz topic and generate questions with Gemini. Then publish to the room.
            </p>
          </CardHeader>

          <CardContent className="pt-8 px-8">
            <form onSubmit={handleGenerateQuiz} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold">
                      Title *
                    </Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="e.g., Advanced Quantum Physics"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="bg-muted/50 border-primary/10 focus:border-primary"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category" className="text-sm font-semibold">
                      Category *
                    </Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category" className="bg-muted/50 border-primary/10">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Knowledge</SelectItem>
                        <SelectItem value="science">Science</SelectItem>
                        <SelectItem value="history">History</SelectItem>
                        <SelectItem value="technology">Technology</SelectItem>
                        <SelectItem value="literature">Literature</SelectItem>
                        <SelectItem value="mathematics">Mathematics</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="difficulty" className="text-sm font-semibold">
                        Difficulty *
                      </Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) => handleSelectChange('difficulty', value)}
                      >
                        <SelectTrigger id="difficulty" className="bg-muted/50 border-primary/10">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="easy">Easy</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="numQuestions" className="text-sm font-semibold">
                        Questions *
                      </Label>
                      <Select
                        value={String(formData.numQuestions)}
                        onValueChange={(value) => handleSelectChange('numQuestions', value)}
                      >
                        <SelectTrigger id="numQuestions" className="bg-muted/50 border-primary/10">
                          <SelectValue placeholder="Select Number of Questions" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="5">5 Questions</SelectItem>
                          <SelectItem value="10">10 Questions</SelectItem>
                          <SelectItem value="15">15 Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="points" className="text-sm font-semibold">
                        Points *
                      </Label>
                      <Input
                        id="points"
                        name="points"
                        type="number"
                        value={formData.points}
                        onChange={handleInputChange}
                        className="bg-muted/50 border-primary/10"
                        min="1"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    placeholder="Provide a brief overview of the quiz topics..."
                    value={formData.description}
                    onChange={handleInputChange}
                    className="bg-muted/50 border-primary/10 h-[155px] resize-none"
                    required
                  />
                </div>
              </div>

              {generatedQuiz && (
                <div className="space-y-4 pt-8 border-t border-primary/10">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-2xl font-bold text-primary">{generatedQuiz.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        Preview below. Click <span className="font-semibold">Publish</span> to start.
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-primary">Points: {generatedQuiz.points}</p>
                      <p className="text-xs text-muted-foreground">
                        Questions: {generatedQuiz.questions?.length ?? 0}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {(generatedQuiz.questions ?? []).map((q, idx) => (
                      <div key={idx} className="p-4 rounded-xl border border-primary/10 bg-muted/20">
                        <p className="font-semibold text-foreground">
                          Q{idx + 1}. {q.text}
                        </p>
                        <ul className="mt-3 space-y-2">
                          {(q.options ?? []).map((opt, optIdx) => (
                            <li key={optIdx} className="text-sm text-muted-foreground">
                              {String.fromCharCode(65 + optIdx)}. {opt}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {generationError && <p className="text-sm text-destructive font-medium">{generationError}</p>}

              <div className="flex gap-4 pt-8 border-t border-primary/10">
                {!generatedQuiz ? (
                  <Button
                    type="submit"
                    className="flex-1 py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    disabled={!canGenerate}
                  >
                    {isGenerating ? 'Generating...' : 'Generate Quiz'}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={handlePublish}
                    className="flex-1 py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                    disabled={!generatedQuiz}
                  >
                    Publish Quiz
                  </Button>
                )}

                <Button
                  type="reset"
                  variant="outline"
                  className="flex-1 py-6 text-lg font-bold border-primary/20 hover:bg-primary/5"
                  onClick={() => {
                    setFormData({
                      title: '',
                      description: '',
                      category: '',
                      difficulty: '',
                      points: 100,
                      numQuestions: 5,
                    })
                    setGeneratedQuiz(null)
                    setGenerationError(null)
                  }}
                  disabled={isGenerating}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';

type Question = {
  text: string;
  options: string[];
  answer: number;
};

export default function QuizForm({ onPublish }: { onPublish?: (quiz: any) => void }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: '',
    points: 100,
    numQuestions: 0,
    questions: [] as Question[],
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'points' || name === 'numQuestions' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    if (name === 'numQuestions') {
      const count = Number(value);
      const currentQuestions = [...formData.questions];
      let newQuestions: Question[] = [];
      
      if (count > currentQuestions.length) {
        // Add empty questions up to count
        newQuestions = [
          ...currentQuestions,
          ...Array(count - currentQuestions.length).fill(null).map(() => ({
            text: '',
            options: ['', '', '', ''],
            answer: 0
          }))
        ];
      } else {
        // Truncate to count
        newQuestions = currentQuestions.slice(0, count);
      }

      setFormData((prev) => ({
        ...prev,
        numQuestions: count,
        questions: newQuestions,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addQuestion = () => {
    setFormData((prev) => ({
      ...prev,
      numQuestions: prev.questions.length + 1,
      questions: [
        ...prev.questions,
        { text: '', options: ['', '', '', ''], answer: 0 },
      ],
    }));
  };

  const removeQuestion = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      numQuestions: Math.max(0, prev.questions.length - 1),
      questions: prev.questions.filter((_, i) => i !== index),
    }));
  };

  const updateQuestion = (index: number, field: keyof Question, value: any) => {
    const newQuestions = [...formData.questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[oIndex] = value;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Handle form submission logic here
  };

  return (
    <div className="bg-transparent">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-2xl border-primary/20 bg-background/80 backdrop-blur-sm">
          <CardHeader className="border-b border-primary/10">
            <CardTitle className="text-center text-3xl font-bold ">
              Create Quiz
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-2 text-center">
              Setup your quiz details and questions for the live session.
            </p>
          </CardHeader>
          <CardContent className="pt-8 px-8">
            <form onSubmit={handleSubmit} className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Basic Info Column */}
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="title" className="text-sm font-semibold">Title *</Label>
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
                    <Label htmlFor="category" className="text-sm font-semibold">Category *</Label>
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
                        <Label htmlFor="difficulty" className="text-sm font-semibold">Difficulty *</Label>
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
                      <Label htmlFor="numQuestions" className="text-sm font-semibold">Questions *</Label>
                      <Select
                        value={formData.numQuestions.toString()}
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
                      <Label htmlFor="points" className="text-sm font-semibold">Points *</Label>
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

                {/* Description Column */}
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-semibold">Description *</Label>
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

              {/* Questions Section */}
              <div className="space-y-6 pt-6 border-t border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold">Questions</h3>
                    <p className="text-xs text-muted-foreground">Add at least one question to your quiz.</p>
                  </div>
                  <Button type="button" onClick={addQuestion} variant="outline" className="gap-2 border-primary/20 hover:bg-primary/5">
                    <Plus className="h-4 w-4" /> Add Question
                  </Button>
                </div>

                <div className="space-y-8">
                  {formData.questions.map((q, qIndex) => (
                    <div key={qIndex} className="relative p-6 rounded-xl border border-primary/10 bg-muted/20 group animate-in fade-in slide-in-from-top-4">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeQuestion(qIndex)}
                        className="absolute right-2 top-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label className="text-xs font-bold uppercase tracking-wider text-primary">Question {qIndex + 1}</Label>
                          <Input
                            placeholder="Enter question text"
                            value={q.text}
                            onChange={(e) => updateQuestion(qIndex, 'text', e.target.value)}
                            className="bg-background border-primary/20 text-lg py-6"
                            required
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 uppercase">
                          {q.options.map((opt, oIndex) => (
                            <div key={oIndex} className="relative group/opt">
                              <Input
                                placeholder={`Option ${oIndex + 1}`}
                                value={opt}
                                onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                className={`pl-10 bg-background transition-all ${
                                    q.answer === oIndex 
                                    ? "border-emerald-500 ring-1 ring-emerald-500/20" 
                                    : "border-primary/10"
                                }`}
                                required
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                onClick={() => updateQuestion(qIndex, 'answer', oIndex)}
                                className={`absolute left-1 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full ${
                                    q.answer === oIndex 
                                    ? "text-emerald-500 bg-emerald-500/10" 
                                    : "text-muted-foreground/30 hover:text-emerald-500 hover:bg-emerald-500/5"
                                }`}
                              >
                                <CheckCircle2 className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {formData.questions.length === 0 && (
                    <div className="p-12 border-2 border-dashed border-primary/10 rounded-2xl text-center">
                        <p className="text-muted-foreground text-sm">No questions added yet. Click 'Add Question' to begin.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-8 border-t border-primary/10">
                <Button
                  type="submit"
                  className="flex-1 py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all"
                  disabled={
                    !formData.title ||
                    !formData.description ||
                    !formData.category ||
                    !formData.difficulty ||
                    formData.questions.length === 0
                  }
                >
                  Publish Quiz
                </Button>
                <Button 
                    type="reset" 
                    variant="outline" 
                    className="flex-1 py-6 text-lg font-bold border-primary/20 hover:bg-primary/5"
                    onClick={() => setFormData({
                        title: '',
                        description: '',
                        category: '',
                        difficulty: '',
                        points: 100,
                        numQuestions: 0,
                        questions: [],
                    })}
                >
                  Reset Form
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

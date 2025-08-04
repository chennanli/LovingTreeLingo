import { supabase } from './supabase'
import type { QuizResult } from './quiz'

export interface DatabaseQuizResult {
  id: string
  user_id: string
  total_questions: number
  correct_answers: number
  percentage: number
  duration: number
  created_at: string
  updated_at: string
}

export interface DatabaseQuizAnswer {
  id: string
  quiz_result_id: string
  question_id: string
  question_type: string
  character_id: string
  selected_answer: string
  correct_answer: string
  is_correct: boolean
  time_spent: number
  created_at: string
}

export interface UserStats {
  totalQuizzes: number
  averageScore: number
  totalCharactersPracticed: number
  currentStreak: number
  bestScore: number
  recentQuizzes: DatabaseQuizResult[]
}

/**
 * Save a quiz result to the database
 */
export async function saveQuizResult(
  userId: string,
  quizResult: QuizResult,
  questions: { id: string; type: string; character: { id: string }; correctAnswer: string }[]
): Promise<{ success: boolean; error?: string }> {
  try {
    // First, save the quiz result
    const { data: savedResult, error: resultError } = await supabase
      .from('quiz_results')
      .insert({
        user_id: userId,
        total_questions: quizResult.totalQuestions,
        correct_answers: quizResult.correctAnswers,
        percentage: quizResult.percentage,
        duration: quizResult.duration
      })
      .select()
      .single()

    if (resultError) {
      console.error('Error saving quiz result:', resultError)
      return { success: false, error: resultError.message }
    }

    // Then save individual answers
    const answersToSave = quizResult.answers.map((answer) => {
      const question = questions.find(q => q.id === answer.questionId)
      return {
        quiz_result_id: savedResult.id,
        question_id: answer.questionId,
        question_type: question?.type || 'unknown',
        character_id: question?.character?.id || 'unknown',
        selected_answer: answer.selectedAnswer,
        correct_answer: question?.correctAnswer || '',
        is_correct: answer.isCorrect,
        time_spent: answer.timeSpent
      }
    })

    const { error: answersError } = await supabase
      .from('quiz_answers')
      .insert(answersToSave)

    if (answersError) {
      console.error('Error saving quiz answers:', answersError)
      // Don't fail completely if answers fail to save, but log it
      return { success: true, error: `Result saved but answers failed: ${answersError.message}` }
    }

    return { success: true }
  } catch (error) {
    console.error('Unexpected error saving quiz result:', error)
    return { success: false, error: 'An unexpected error occurred while saving the quiz result' }
  }
}

/**
 * Get user's quiz history with pagination
 */
export async function getUserQuizHistory(
  userId: string,
  limit: number = 10,
  offset: number = 0
): Promise<{ results: DatabaseQuizResult[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('Error fetching quiz history:', error)
      return { results: [], error: error.message }
    }

    return { results: data || [] }
  } catch (error) {
    console.error('Unexpected error fetching quiz history:', error)
    return { results: [], error: 'An unexpected error occurred while fetching quiz history' }
  }
}

/**
 * Get user statistics for dashboard
 */
export async function getUserStats(userId: string): Promise<{ stats: UserStats | null; error?: string }> {
  try {
    // Get basic quiz statistics
    const { data: quizData, error: quizError } = await supabase
      .from('quiz_results')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (quizError) {
      console.error('Error fetching user stats:', quizError)
      return { stats: null, error: quizError.message }
    }

    if (!quizData || quizData.length === 0) {
      return {
        stats: {
          totalQuizzes: 0,
          averageScore: 0,
          totalCharactersPracticed: 0,
          currentStreak: 0,
          bestScore: 0,
          recentQuizzes: []
        }
      }
    }

    // Calculate statistics
    const totalQuizzes = quizData.length
    const averageScore = Math.round(
      quizData.reduce((sum, quiz) => sum + quiz.percentage, 0) / totalQuizzes
    )
    const bestScore = Math.max(...quizData.map(quiz => quiz.percentage))

    // Get unique characters practiced
    const { data: answerData, error: answerError } = await supabase
      .from('quiz_answers')
      .select('character_id')
      .in('quiz_result_id', quizData.map(q => q.id))

    const totalCharactersPracticed = answerError
      ? 0
      : new Set(answerData?.map(a => a.character_id) || []).size

    // Calculate current streak (consecutive days with quizzes)
    let currentStreak = 0
    const today = new Date()
    const checkDate = new Date(today)
    
    for (let i = 0; i < quizData.length; i++) {
      const quizDate = new Date(quizData[i].created_at)
      const daysDiff = Math.floor((checkDate.getTime() - quizDate.getTime()) / (1000 * 60 * 60 * 24))
      
      if (daysDiff === currentStreak) {
        currentStreak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else if (daysDiff > currentStreak) {
        break
      }
    }

    return {
      stats: {
        totalQuizzes,
        averageScore,
        totalCharactersPracticed,
        currentStreak,
        bestScore,
        recentQuizzes: quizData.slice(0, 5) // Last 5 quizzes
      }
    }
  } catch (error) {
    console.error('Unexpected error calculating user stats:', error)
    return { stats: null, error: 'An unexpected error occurred while calculating statistics' }
  }
}

/**
 * Initialize database tables (for development/setup)
 */
export async function initializeQuizTables(): Promise<{ success: boolean; error?: string }> {
  try {
    // This would typically be done via migration files
    // For now, we'll return success and rely on manual setup
    console.log('Database tables should be set up manually via Supabase dashboard or migration files')
    return { success: true }
  } catch (_error) {
    return { success: false, error: 'Database initialization not implemented' }
  }
}

/**
 * Check if quiz tables exist and are accessible
 */
export async function checkDatabaseSetup(): Promise<{ isSetup: boolean; error?: string }> {
  try {
    // Try to query the quiz_results table
    const { error } = await supabase
      .from('quiz_results')
      .select('id')
      .limit(1)

    if (error) {
      if (error.message.includes('relation "quiz_results" does not exist')) {
        return { isSetup: false, error: 'Quiz results table does not exist. Please set up the database schema.' }
      }
      return { isSetup: false, error: error.message }
    }

    return { isSetup: true }
  } catch (_error) {
    return { isSetup: false, error: 'Unable to check database setup' }
  }
}
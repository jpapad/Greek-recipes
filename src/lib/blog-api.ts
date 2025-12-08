// Blog API functions for Supabase
import { supabase } from './supabaseClient';
import type { Article, ArticleCategory, UserProfile, ArticleComment } from './types';

// ==================== CATEGORIES ====================

export async function getArticleCategories(): Promise<ArticleCategory[]> {
  try {
    const { data, error } = await supabase
      .from('article_categories')
      .select('*')
      .order('name');

    if (error) {
      // If table doesn't exist yet, return empty array silently
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('Blog tables not created yet. Run blog-system.sql migration.');
        return [];
      }
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching article categories:', error);
    return [];
  }
}

export async function createArticleCategory(category: Omit<ArticleCategory, 'id' | 'created_at' | 'updated_at'>): Promise<ArticleCategory | null> {
  try {
    const { data, error } = await supabase
      .from('article_categories')
      .insert(category)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating article category:', error);
    return null;
  }
}

export async function updateArticleCategory(id: string, category: Partial<Omit<ArticleCategory, 'id' | 'created_at' | 'updated_at'>>): Promise<ArticleCategory | null> {
  try {
    const { data, error } = await supabase
      .from('article_categories')
      .update(category)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating article category:', error);
    return null;
  }
}

export async function deleteArticleCategory(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('article_categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting article category:', error);
    return false;
  }
}

// ==================== ARTICLES ====================

export async function getArticles(options?: {
  status?: 'draft' | 'published' | 'archived';
  category?: string;
  tag?: string;
  authorId?: string;
  search?: string;
  limit?: number;
}): Promise<Article[]> {
  try {
    let query = supabase
      .from('articles')
      .select(`
        *,
        category:article_categories(*)
      `)
      .order('created_at', { ascending: false });

    if (options?.status) {
      query = query.eq('status', options.status);
    }

    if (options?.category) {
      query = query.eq('category_id', options.category);
    }

    if (options?.tag) {
      query = query.contains('tags', [options.tag]);
    }

    if (options?.authorId) {
      query = query.eq('author_id', options.authorId);
    }

    if (options?.search) {
      query = query.or(`title.ilike.%${options.search}%,excerpt.ilike.%${options.search}%`);
    }

    if (options?.limit) {
      query = query.limit(options.limit);
    }

    const { data, error } = await query;

    if (error) {
      // If table doesn't exist yet, return empty array silently
      if (error.code === '42P01' || error.message?.includes('does not exist')) {
        console.warn('Blog tables not created yet. Run blog-system.sql migration.');
        return [];
      }
      console.error('Supabase error fetching articles:', {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .select(`
        *,
        category:article_categories(*),
        author:user_roles(user_id, bio, avatar_url)
      `)
      .eq('slug', slug)
      .single();

    if (error) throw error;

    // Increment views count
    if (data) {
      await supabase
        .from('articles')
        .update({ views_count: (data.views_count || 0) + 1 })
        .eq('id', data.id);
    }

    return data;
  } catch (error) {
    console.error('Error fetching article:', error);
    return null;
  }
}

export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at'>): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating article:', error);
    return null;
  }
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  try {
    const { data, error } = await supabase
      .from('articles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating article:', error);
    return null;
  }
}

export async function deleteArticle(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('articles')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting article:', error);
    return false;
  }
}

// ==================== USER ROLES ====================

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('user_roles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error) {
      // If user doesn't have a profile, create one
      if (error.code === 'PGRST116') {
        const { data: newProfile, error: insertError } = await supabase
          .from('user_roles')
          .insert({ user_id: userId })
          .select()
          .single();

        if (insertError) throw insertError;
        return newProfile;
      }
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
}

export async function searchUsers(query: string): Promise<UserProfile[]> {
  try {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('user_id, display_name, avatar_url, bio')
      .ilike('display_name', `%${query}%`)
      .limit(10);

    if (error) throw error;

    // Map display_name to name for consistency with UserProfile type
    return (data || []).map(p => ({
      ...p,
      name: p.display_name
    }));
  } catch (error) {
    console.error('Error searching users:', error);
    return [];
  }
}

// ==================== COMMENTS ====================

export async function getArticleComments(articleId: string): Promise<ArticleComment[]> {
  try {
    const { data, error } = await supabase
      .from('article_comments')
      .select('*')
      .eq('article_id', articleId)
      .eq('status', 'approved')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    return [];
  }
}

export async function createArticleComment(comment: Omit<ArticleComment, 'id' | 'created_at' | 'status'>): Promise<ArticleComment | null> {
  try {
    const { data, error } = await supabase
      .from('article_comments')
      .insert({ ...comment, status: 'pending' })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    return null;
  }
}

export async function updateCommentStatus(commentId: string, status: 'approved' | 'rejected'): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('article_comments')
      .update({ status })
      .eq('id', commentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating comment status:', error);
    return false;
  }
}

export async function deleteArticleComment(commentId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('article_comments')
      .delete()
      .eq('id', commentId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting comment:', error);
    return false;
  }
}

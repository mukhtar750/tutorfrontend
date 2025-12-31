import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { 
  Save, 
  Eye, 
  Upload, 
  Sparkles,
  ImagePlus,
  Type,
  Palette,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { toast } from 'sonner@2.0.3';
import axios from 'axios';

interface HeroContent {
  headline: string;
  subheadline: string;
  description: string;
  ctaPrimary: string;
  ctaSecondary: string;
  heroImage: string;
  badgeText: string;
  stats: {
    students: string;
    passRate: string;
    rating: string;
  };
}

const defaultContent: HeroContent = {
  headline: 'Ace Your',
  subheadline: 'WAEC & NECO',
  description: 'Join the revolution in secondary education. Learn from expert instructors, attend live classes, and track your progress in real-time. Your success story starts here.',
  ctaPrimary: 'Start Learning Free',
  ctaSecondary: 'Watch Demo',
  heroImage: 'https://images.unsplash.com/photo-1760348082205-8bda5fbdd7b5',
  badgeText: "Nigeria's #1 Learning Platform",
  stats: {
    students: '10K+',
    passRate: '98%',
    rating: '4.9★'
  }
};

export function HeroEditor() {
  const [content, setContent] = useState<HeroContent>(defaultContent);
  const [showPreview, setShowPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchHeroContent();
  }, []);

  const fetchHeroContent = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:8000/api/settings/hero');
      if (response.data) {
        // Ensure stats object exists and merge with defaults
        const fetchedData = response.data;
        setContent({
          ...defaultContent,
          ...fetchedData,
          stats: {
            ...defaultContent.stats,
            ...(fetchedData.stats || {})
          }
        });
      }
    } catch (error) {
      console.error('Failed to fetch hero content', error);
      // Fallback to default content if fetch fails or no content
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    try {
      const token = localStorage.getItem('auth_token');
      await axios.post('http://localhost:8000/api/admin/settings/hero', content, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      toast.success('Hero Content Saved!', {
        description: 'Landing page has been updated successfully',
      });
    } catch (error) {
      console.error('Failed to save hero content', error);
      toast.error('Failed to save content', {
        description: 'Please try again later',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setContent(defaultContent);
    toast.info('Content Reset', {
      description: 'Hero content has been reset to defaults. Click save to apply.',
    });
  };

  if (isLoading) {
    return <div className="p-8 text-center">Loading editor...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold dark:text-white">Hero Content Editor</h1>
          <p className="text-muted-foreground">Customize your landing page hero section</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline"
            onClick={() => setShowPreview(!showPreview)}
            className="dark:border-white/10"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Hide Preview' : 'Show Preview'}
          </Button>
          <Button 
            variant="outline"
            onClick={handleReset}
            className="dark:border-white/10"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-gradient-to-r from-blue-600 to-purple-600"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-6">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <Type className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Text Content</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="badge" className="dark:text-gray-300">Badge Text</Label>
                  <Input
                    id="badge"
                    value={content.badgeText}
                    onChange={(e) => setContent({ ...content, badgeText: e.target.value })}
                    placeholder="e.g., Nigeria's #1 Learning Platform"
                    className="dark:bg-white/5 dark:border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="headline" className="dark:text-gray-300">Headline (Part 1)</Label>
                  <Input
                    id="headline"
                    value={content.headline}
                    onChange={(e) => setContent({ ...content, headline: e.target.value })}
                    placeholder="e.g., Ace Your"
                    className="dark:bg-white/5 dark:border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subheadline" className="dark:text-gray-300">
                    Headline (Part 2 - Gradient)
                    <Badge className="ml-2 bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                      Gradient
                    </Badge>
                  </Label>
                  <Input
                    id="subheadline"
                    value={content.subheadline}
                    onChange={(e) => setContent({ ...content, subheadline: e.target.value })}
                    placeholder="e.g., WAEC & NECO"
                    className="dark:bg-white/5 dark:border-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="dark:text-gray-300">Description</Label>
                  <Textarea
                    id="description"
                    value={content.description}
                    onChange={(e) => setContent({ ...content, description: e.target.value })}
                    placeholder="Enter hero description..."
                    rows={4}
                    className="dark:bg-white/5 dark:border-white/10"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ctaPrimary" className="dark:text-gray-300">Primary Button</Label>
                    <Input
                      id="ctaPrimary"
                      value={content.ctaPrimary}
                      onChange={(e) => setContent({ ...content, ctaPrimary: e.target.value })}
                      placeholder="e.g., Get Started"
                      className="dark:bg-white/5 dark:border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ctaSecondary" className="dark:text-gray-300">Secondary Button</Label>
                    <Input
                      id="ctaSecondary"
                      value={content.ctaSecondary}
                      onChange={(e) => setContent({ ...content, ctaSecondary: e.target.value })}
                      placeholder="e.g., Watch Demo"
                      className="dark:bg-white/5 dark:border-white/10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Hero Statistics</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="students" className="dark:text-gray-300">Students</Label>
                    <Input
                      id="students"
                      value={content.stats.students}
                      onChange={(e) => setContent({ 
                        ...content, 
                        stats: { ...content.stats, students: e.target.value }
                      })}
                      placeholder="10K+"
                      className="dark:bg-white/5 dark:border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passRate" className="dark:text-gray-300">Pass Rate</Label>
                    <Input
                      id="passRate"
                      value={content.stats.passRate}
                      onChange={(e) => setContent({ 
                        ...content, 
                        stats: { ...content.stats, passRate: e.target.value }
                      })}
                      placeholder="98%"
                      className="dark:bg-white/5 dark:border-white/10"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating" className="dark:text-gray-300">Rating</Label>
                    <Input
                      id="rating"
                      value={content.stats.rating}
                      onChange={(e) => setContent({ 
                        ...content, 
                        stats: { ...content.stats, rating: e.target.value }
                      })}
                      placeholder="4.9★"
                      className="dark:bg-white/5 dark:border-white/10"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center">
                    <ImagePlus className="w-5 h-5 text-white" />
                  </div>
                  <CardTitle className="dark:text-white">Hero Image</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="heroImage" className="dark:text-gray-300">Image URL</Label>
                  <Input
                    id="heroImage"
                    value={content.heroImage}
                    onChange={(e) => setContent({ ...content, heroImage: e.target.value })}
                    placeholder="Enter image URL..."
                    className="dark:bg-white/5 dark:border-white/10"
                  />
                </div>

                <div className="relative group">
                  <img 
                    src={content.heroImage}
                    alt="Hero preview"
                    className="w-full h-48 object-cover rounded-xl"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl flex items-center justify-center">
                    <Button size="sm" className="bg-white/20 backdrop-blur-xl">
                      <Upload className="w-4 h-4 mr-2" />
                      Upload New
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Recommended size: 1200x800px. Supports JPG, PNG, WebP
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Live Preview */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:sticky lg:top-6"
        >
          <Card className="bg-white dark:bg-gray-900/50 backdrop-blur-xl border-gray-200 dark:border-white/10 overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              <div className="flex items-center gap-3">
                <Eye className="w-5 h-5" />
                <CardTitle>Live Preview</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {/* Preview Content */}
              <div className="relative overflow-hidden bg-black text-white p-8">
                {/* Background Effect */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500 rounded-full blur-3xl" />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/20 border border-blue-500/30 text-xs">
                    <Sparkles className="w-3 h-3 text-yellow-400" />
                    <span>{content.badgeText}</span>
                  </div>

                  {/* Headline */}
                  <div>
                    <h1 className="text-3xl font-bold leading-tight">
                      <span className="block">{content.headline}</span>
                      <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {content.subheadline}
                      </span>
                    </h1>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {content.description}
                  </p>

                  {/* Buttons */}
                  <div className="flex gap-2">
                    <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-xs">
                      {content.ctaPrimary}
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/20 text-white text-xs">
                      {content.ctaSecondary}
                    </Button>
                  </div>

                  {/* Stats */}
                  <div className="flex gap-4 pt-4">
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        {content.stats.passRate}
                      </p>
                      <p className="text-xs text-gray-400">Pass Rate</p>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                        {content.stats.students}
                      </p>
                      <p className="text-xs text-gray-400">Students</p>
                    </div>
                    <div className="w-px bg-white/20" />
                    <div>
                      <p className="text-xl font-bold bg-gradient-to-r from-pink-400 to-orange-400 bg-clip-text text-transparent">
                        {content.stats.rating}
                      </p>
                      <p className="text-xs text-gray-400">Rating</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hero Image Preview */}
              <div className="relative h-48">
                <img 
                  src={content.heroImage}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="mt-6 bg-gradient-to-br from-blue-500/10 to-purple-500/10 border-blue-500/20 dark:border-blue-500/30">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <Palette className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-sm dark:text-white mb-1">Pro Tips</p>
                  <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                    <li>• Keep headlines short and impactful (5-7 words)</li>
                    <li>• Use action verbs in CTA buttons</li>
                    <li>• Update stats regularly to maintain credibility</li>
                    <li>• High-quality images increase conversion by 40%</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

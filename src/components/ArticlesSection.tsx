import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { 
  ArrowLeft, 
  BookOpen, 
  Search, 
  Clock, 
  Heart,
  Baby,
  Apple,
  Activity,
  AlertCircle,
  CheckCircle,
  Bookmark,
  Share
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ArticlesSectionProps {
  onBack: () => void;
}

export function ArticlesSection({ onBack }: ArticlesSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const categories = [
    { id: 'all', name: 'All Articles', icon: BookOpen },
    { id: 'prenatal', name: 'Prenatal Care', icon: Heart },
    { id: 'nutrition', name: 'Nutrition', icon: Apple },
    { id: 'exercise', name: 'Exercise', icon: Activity },
    { id: 'baby', name: 'Baby Care', icon: Baby }
  ];

  const articles = [
    {
      id: '1',
      title: 'Essential Nutrition During Second Trimester',
      summary: 'Key nutrients and foods to focus on during weeks 13-27 of pregnancy.',
      category: 'nutrition',
      readTime: '5 min read',
      date: '2025-01-10',
      featured: true,
      bookmarked: false,
      content: `During the second trimester, your baby is growing rapidly and needs proper nutrition. Here are the essential nutrients to focus on:

**Key Nutrients:**
• Protein: 71g daily for tissue development
• Iron: 27mg daily to prevent anemia
• Calcium: 1000mg daily for bone development
• Folic Acid: 600mcg daily for neural development

**Best Food Sources:**
• Lean meats, fish, eggs, legumes
• Dark leafy greens, fortified cereals
• Dairy products, almonds
• Citrus fruits, fortified grains

**Foods to Avoid:**
• Raw or undercooked meats
• High-mercury fish
• Unpasteurized dairy products
• Excessive caffeine

Remember to take your prenatal vitamins and stay hydrated with 8-10 glasses of water daily.`
    },
    {
      id: '2',
      title: 'Safe Exercise Routines for Pregnant Women',
      summary: 'Gentle exercises that are safe and beneficial during pregnancy.',
      category: 'exercise',
      readTime: '7 min read',
      date: '2025-01-08',
      featured: false,
      bookmarked: true,
      content: `Regular exercise during pregnancy can help improve your mood, energy levels, and prepare your body for delivery.

**Safe Exercises:**
• Walking: 30 minutes daily
• Swimming: Low-impact, full-body workout
• Prenatal yoga: Improves flexibility and relaxation
• Stationary cycling: Cardiovascular fitness

**Benefits:**
• Reduces back pain and swelling
• Improves sleep quality
• Boosts mood and energy
• Prepares body for labor

**Warning Signs to Stop:**
• Dizziness or headache
• Chest pain or difficulty breathing
• Vaginal bleeding
• Decreased fetal movement

Always consult your doctor before starting any exercise routine.`
    },
    {
      id: '3',
      title: 'Understanding Prenatal Checkup Schedules',
      summary: 'What to expect during your regular prenatal appointments.',
      category: 'prenatal',
      readTime: '6 min read',
      date: '2025-01-05',
      featured: false,
      bookmarked: false,
      content: `Regular prenatal checkups are crucial for monitoring your health and your baby's development.

**First Trimester (Weeks 1-12):**
• Initial appointment: Confirm pregnancy, medical history
• Monthly visits: Basic measurements, urine tests
• 8-12 weeks: First ultrasound

**Second Trimester (Weeks 13-27):**
• Bi-weekly visits: Growth monitoring
• 15-20 weeks: Genetic screening options
• 18-22 weeks: Anatomy scan ultrasound

**Third Trimester (Weeks 28-40):**
• Weekly visits: Position and size checks
• 28 weeks: Glucose tolerance test
• 35-37 weeks: Group B strep test

**What to Bring:**
• Insurance cards and ID
• List of questions
• Previous medical records
• Prenatal vitamins`
    },
    {
      id: '4',
      title: 'Preparing for Your Baby\'s Arrival',
      summary: 'Essential items and preparations for welcoming your newborn.',
      category: 'baby',
      readTime: '8 min read',
      date: '2025-01-03',
      featured: false,
      bookmarked: false,
      content: `Getting ready for your baby's arrival involves both practical preparations and emotional readiness.

**Essential Baby Items:**
• Newborn diapers and wipes
• Onesies and sleepers (0-3 months)
• Swaddle blankets
• Car seat (installed properly)
• Bassinet or crib

**Hospital Bag Checklist:**
• Comfortable clothes for labor
• Going-home outfit (for you and baby)
• Phone charger and camera
• Insurance cards and birth plan

**Home Preparations:**
• Baby-proof the nursery
• Install smoke detectors
• Have emergency contacts ready
• Prepare meals in advance

**Postpartum Care:**
• Arrange help for first few weeks
• Stock up on postpartum supplies
• Have lactation consultant contact ready
• Plan for emotional support`
    },
    {
      id: '5',
      title: 'Managing Common Pregnancy Discomforts',
      summary: 'Tips for dealing with morning sickness, fatigue, and other symptoms.',
      category: 'prenatal',
      readTime: '5 min read',
      date: '2025-01-01',
      featured: false,
      bookmarked: true,
      content: `Pregnancy brings various physical changes. Here's how to manage common discomforts:

**Morning Sickness:**
• Eat small, frequent meals
• Keep crackers by your bedside
• Try ginger tea or supplements
• Avoid strong odors

**Fatigue:**
• Take short naps during the day
• Go to bed earlier
• Light exercise can boost energy
• Ask for help with daily tasks

**Back Pain:**
• Wear supportive shoes
• Use pregnancy pillows
• Practice good posture
• Gentle stretching exercises

**Heartburn:**
• Eat smaller, more frequent meals
• Avoid spicy and fatty foods
• Don't lie down immediately after eating
• Sleep with head elevated

**When to Call Your Doctor:**
• Severe or persistent symptoms
• Signs of dehydration
• Fever or unusual pain
• Concerns about baby's movement`
    }
  ];

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const featuredArticles = articles.filter(article => article.featured);

  if (selectedArticle) {
    const article = articles.find(a => a.id === selectedArticle);
    if (!article) return null;

    return (
      <div className="min-h-screen bg-white safe-area-top safe-area-bottom">
        {/* Mobile Article Header */}
        <div className="bg-white shadow-sm border-b sticky top-0 z-10">
          <div className="px-4 py-3">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setSelectedArticle(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon">
                  <Bookmark className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Share className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Article Content */}
        <div className="max-w-md mx-auto px-4 py-6">
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-3">
              <Clock className="w-4 h-4" />
              <span>{article.readTime}</span>
              <span>•</span>
              <span>{article.date}</span>
            </div>
            
            <h1 className="text-2xl font-medium mb-4">{article.title}</h1>
            
            <div className="h-48 bg-gray-100 rounded-lg mb-6 overflow-hidden">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1603689781800-a95cd1a9201b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwcmVnbmFuY3klMjBoZWFsdGglMjBhcnRpY2xlc3xlbnwxfHx8fDE3NTkwNzk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                alt={article.title}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          <div className="prose prose-sm max-w-none">
            {article.content.split('\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                return (
                  <h3 key={index} className="font-medium text-gray-900 mt-6 mb-3">
                    {paragraph.slice(2, -2)}
                  </h3>
                );
              } else if (paragraph.startsWith('•')) {
                return (
                  <li key={index} className="text-gray-700 mb-1">
                    {paragraph.slice(2)}
                  </li>
                );
              } else if (paragraph.trim() === '') {
                return <br key={index} />;
              } else {
                return (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed">
                    {paragraph}
                  </p>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 safe-area-top safe-area-bottom">
      {/* Mobile Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" onClick={onBack} className="h-10 w-10">
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="font-medium">Health Articles</h1>
              <p className="text-xs text-muted-foreground">Tips & guides for pregnancy</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4 pb-20">
        {/* Mobile Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 h-10"
          />
        </div>

        {/* Categories */}
        <div className="flex space-x-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "outline"}
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category.id)}
              >
                <Icon className="w-4 h-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Featured Articles */}
        {selectedCategory === 'all' && featuredArticles.length > 0 && (
          <div>
            <h2 className="font-medium mb-3">Featured Articles</h2>
            {featuredArticles.map((article) => (
              <Card 
                key={article.id}
                className="cursor-pointer transition-all hover:shadow-lg mb-3"
                onClick={() => setSelectedArticle(article.id)}
              >
                <CardContent className="p-0">
                  <div className="h-32 bg-gradient-to-r from-pink-100 to-blue-100 relative overflow-hidden rounded-t-lg">
                    <ImageWithFallback
                      src="https://images.unsplash.com/photo-1603689781800-a95cd1a9201b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHxwcmVnbmFuY3klMjBoZWFsdGglMjBhcnRpY2xlc3xlbnwxfHx8fDE3NTkwNzk4NTV8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                      alt={article.title}
                      className="w-full h-full object-cover"
                    />
                    <Badge className="absolute top-2 left-2 bg-pink-500">Featured</Badge>
                  </div>
                  <div className="p-4">
                    <h3 className="font-medium mb-2">{article.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{article.summary}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-2">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <span>{article.date}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* All Articles */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h2 className="font-medium">
              {selectedCategory === 'all' ? 'All Articles' : 
               categories.find(c => c.id === selectedCategory)?.name}
            </h2>
            <Badge variant="secondary">{filteredArticles.length} articles</Badge>
          </div>
          
          <div className="space-y-3">
            {filteredArticles.map((article) => (
              <Card 
                key={article.id}
                className="cursor-pointer transition-all hover:shadow-md"
                onClick={() => setSelectedArticle(article.id)}
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{article.title}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{article.summary}</p>
                    </div>
                    {article.bookmarked && (
                      <Bookmark className="w-4 h-4 text-blue-500 fill-current ml-2" />
                    )}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{article.readTime}</span>
                      </div>
                      <span>{article.date}</span>
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {categories.find(c => c.id === article.category)?.name}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {filteredArticles.length === 0 && (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-medium text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600 text-sm">Try adjusting your search terms or category filter.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
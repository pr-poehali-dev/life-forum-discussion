import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';

interface Discussion {
  id: number;
  title: string;
  category: string;
  author: string;
  authorInitials: string;
  meTooCount: number;
  commentsCount: number;
  excerpt: string;
  timeAgo: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  author: string;
  authorInitials: string;
  text: string;
  timeAgo: string;
}

const categories = [
  { id: 'all', name: 'Все темы', icon: 'Grid3x3', color: 'bg-muted' },
  { id: 'relationships', name: 'Отношения', icon: 'Heart', color: 'bg-red-100' },
  { id: 'career', name: 'Карьера', icon: 'Briefcase', color: 'bg-blue-100' },
  { id: 'health', name: 'Здоровье', icon: 'Activity', color: 'bg-green-100' },
  { id: 'growth', name: 'Саморазвитие', icon: 'Sparkles', color: 'bg-purple-100' },
  { id: 'finance', name: 'Финансы', icon: 'DollarSign', color: 'bg-yellow-100' },
];

const mockDiscussions: Discussion[] = [
  {
    id: 1,
    title: 'Как найти баланс между работой и личной жизнью?',
    category: 'career',
    author: 'Анна М.',
    authorInitials: 'АМ',
    meTooCount: 247,
    commentsCount: 42,
    excerpt: 'Работаю по 12 часов в день, совсем не остается времени на себя и близких. Чувствую, что выгораю...',
    timeAgo: '2 часа назад',
    comments: [
      {
        id: 1,
        author: 'Дмитрий К.',
        authorInitials: 'ДК',
        text: 'У меня была похожая ситуация. Помогло четкое разграничение времени и отключение рабочих уведомлений после 19:00.',
        timeAgo: '1 час назад'
      },
      {
        id: 2,
        author: 'Елена С.',
        authorInitials: 'ЕС',
        text: 'Попробуй технику pomodoro и обязательно планируй время для отдыха так же серьёзно, как рабочие встречи.',
        timeAgo: '30 минут назад'
      }
    ]
  },
  {
    id: 2,
    title: 'Чувствую себя одиноко, даже находясь среди людей',
    category: 'relationships',
    author: 'Михаил П.',
    authorInitials: 'МП',
    meTooCount: 189,
    commentsCount: 35,
    excerpt: 'Много общения на работе, но все поверхностное. Не с кем поговорить о том, что действительно волнует...',
    timeAgo: '5 часов назад',
    comments: [
      {
        id: 1,
        author: 'Ольга Н.',
        authorInitials: 'ОН',
        text: 'Знакомое чувство. Мне помогли тематические встречи по интересам - там люди изначально открыты к глубоким разговорам.',
        timeAgo: '3 часа назад'
      }
    ]
  },
  {
    id: 3,
    title: 'Постоянно откладываю важные дела на потом',
    category: 'growth',
    author: 'Светлана Р.',
    authorInitials: 'СР',
    meTooCount: 312,
    commentsCount: 58,
    excerpt: 'Знаю, что нужно заняться здоровьем, научиться чему-то новому, но каждый день находятся "более срочные" дела...',
    timeAgo: '1 день назад',
    comments: [
      {
        id: 1,
        author: 'Игорь В.',
        authorInitials: 'ИВ',
        text: 'Прокрастинация часто защитный механизм. Попробуй начать с 5 минут в день - минимальный порог входа снимает страх.',
        timeAgo: '12 часов назад'
      }
    ]
  },
  {
    id: 4,
    title: 'Боюсь не оправдать ожидания родителей',
    category: 'relationships',
    author: 'Алексей Т.',
    authorInitials: 'АТ',
    meTooCount: 156,
    commentsCount: 29,
    excerpt: 'Они вложили в меня столько сил, а я выбрал совсем другой путь. Постоянное чувство вины...',
    timeAgo: '3 дня назад',
    comments: []
  },
  {
    id: 5,
    title: 'Не понимаю, куда уходят деньги',
    category: 'finance',
    author: 'Мария К.',
    authorInitials: 'МК',
    meTooCount: 203,
    commentsCount: 44,
    excerpt: 'Зарплата вроде нормальная, но к концу месяца всегда ноль. Хочу начать откладывать, но не получается...',
    timeAgo: '1 неделю назад',
    comments: []
  }
];

const stats = [
  { category: 'Отношения', count: 1247, trend: '+12%' },
  { category: 'Карьера', count: 892, trend: '+8%' },
  { category: 'Здоровье', count: 743, trend: '+15%' },
  { category: 'Саморазвитие', count: 1089, trend: '+22%' },
  { category: 'Финансы', count: 634, trend: '+5%' },
];

export default function Index() {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDiscussion, setSelectedDiscussion] = useState<Discussion | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const filteredDiscussions = mockDiscussions.filter((discussion) => {
    const matchesCategory = selectedCategory === 'all' || discussion.category === selectedCategory;
    const matchesSearch = discussion.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          discussion.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleDiscussionClick = (discussion: Discussion) => {
    setSelectedDiscussion(discussion);
    setDialogOpen(true);
  };

  const totalDiscussions = mockDiscussions.length;
  const totalMeToo = mockDiscussions.reduce((sum, d) => sum + d.meTooCount, 0);
  const totalComments = mockDiscussions.reduce((sum, d) => sum + d.commentsCount, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/20">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 text-center animate-fade-in">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Пространство для откровенных разговоров
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Делитесь переживаниями, находите понимание и узнавайте, что вы не одиноки в своих мыслях
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <Card className="lg:col-span-1 hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Icon name="TrendingUp" size={20} />
                Статистика
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Всего обсуждений</span>
                  <span className="font-semibold text-xl">{totalDiscussions}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Людей откликнулись</span>
                  <span className="font-semibold text-xl">{totalMeToo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Комментариев</span>
                  <span className="font-semibold text-xl">{totalComments}</span>
                </div>
              </div>

              <div className="pt-4 border-t">
                <h4 className="text-sm font-medium mb-3">Популярные категории</h4>
                <div className="space-y-2">
                  {stats.map((stat) => (
                    <div key={stat.category} className="flex justify-between items-center text-sm">
                      <span className="text-muted-foreground">{stat.category}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{stat.count}</span>
                        <Badge variant="secondary" className="text-xs">{stat.trend}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Поиск и фильтры</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Поиск по обсуждениям..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className="gap-2"
                    >
                      <Icon name={category.icon} size={16} />
                      {category.name}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {filteredDiscussions.map((discussion, index) => (
                <Card
                  key={discussion.id}
                  className="hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer animate-fade-in"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleDiscussionClick(discussion)}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-secondary text-secondary-foreground">
                              {discussion.authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{discussion.author}</p>
                            <p className="text-xs text-muted-foreground">{discussion.timeAgo}</p>
                          </div>
                        </div>
                        <CardTitle className="text-xl mb-2">{discussion.title}</CardTitle>
                        <CardDescription className="text-base">{discussion.excerpt}</CardDescription>
                      </div>
                      <Badge variant="secondary" className="shrink-0">
                        {categories.find(c => c.id === discussion.category)?.name}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-6 text-sm text-muted-foreground">
                      <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Icon name="Heart" size={16} />
                        <span className="font-medium">{discussion.meTooCount} человек откликнулись</span>
                      </button>
                      <button className="flex items-center gap-2 hover:text-primary transition-colors">
                        <Icon name="MessageCircle" size={16} />
                        <span>{discussion.commentsCount} комментариев</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          {selectedDiscussion && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-secondary text-secondary-foreground">
                      {selectedDiscussion.authorInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{selectedDiscussion.author}</p>
                    <p className="text-sm text-muted-foreground">{selectedDiscussion.timeAgo}</p>
                  </div>
                </div>
                <DialogTitle className="text-2xl">{selectedDiscussion.title}</DialogTitle>
                <DialogDescription className="text-base pt-2">
                  {selectedDiscussion.excerpt}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-6">
                <div className="flex items-center gap-6">
                  <Button variant="outline" className="gap-2">
                    <Icon name="Heart" size={16} />
                    У меня тоже ({selectedDiscussion.meTooCount})
                  </Button>
                  <span className="text-sm text-muted-foreground">
                    {selectedDiscussion.commentsCount} комментариев
                  </span>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold text-lg">Комментарии</h3>
                  {selectedDiscussion.comments.length > 0 ? (
                    selectedDiscussion.comments.map((comment) => (
                      <Card key={comment.id}>
                        <CardContent className="pt-4">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                                {comment.authorInitials}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm">{comment.author}</span>
                                <span className="text-xs text-muted-foreground">{comment.timeAgo}</span>
                              </div>
                              <p className="text-sm">{comment.text}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-muted-foreground text-center py-8">
                      Пока нет комментариев. Будьте первым, кто поделится своим опытом!
                    </p>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

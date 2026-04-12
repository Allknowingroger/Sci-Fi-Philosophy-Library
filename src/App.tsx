import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Search, 
  Book as BookIcon, 
  Youtube, 
  ExternalLink, 
  Filter,
  Library as LibraryIcon,
  Sparkles,
  ChevronRight,
  Info,
  Calendar,
  Quote,
  Heart,
  Bookmark,
  LayoutGrid,
  List,
  ArrowRight,
  Star,
  Share2
} from "lucide-react";
import { books, Book } from "./data/books";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

const CATEGORIES = [
  "All",
  "Featured",
  "Reading List",
  "Top Recommendations",
  "Classic & Foundational",
  "Mind-Bending",
  "Complex Physics & Post-Apocalyptic",
  "Bonus Mentioned"
];

export default function App() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("sci-fi-favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse favorites", e);
      }
    }
  }, []);

  // Save favorites to localStorage
  useEffect(() => {
    localStorage.setItem("sci-fi-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]
    );
  };

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch = 
        book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesCategory = true;
      if (activeCategory === "Featured") {
        matchesCategory = !!book.isFeatured;
      } else if (activeCategory === "Reading List") {
        matchesCategory = favorites.includes(book.id);
      } else if (activeCategory !== "All") {
        matchesCategory = book.category === activeCategory;
      }

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, activeCategory, favorites]);

  const featuredBook = useMemo(() => {
    const featured = books.filter(b => b.isFeatured);
    return featured[Math.floor(Math.random() * featured.length)] || books[0];
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-sans overflow-x-hidden">
      {/* Visual Scan Line Overlay */}
      <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden opacity-[0.08]">
        <div className="w-full h-[1px] bg-primary/30 absolute top-0 animate-[scan_8s_linear_infinite]" />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.05)_50%),linear-gradient(90deg,rgba(255,0,0,0.03),rgba(0,255,0,0.01),rgba(0,0,255,0.03))] bg-[length:100%_2px,3px_100%] pointer-events-none" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <LibraryIcon className="w-6 h-6 text-primary" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-heading font-bold tracking-tight">Sci-Fi Philosophy</h1>
              <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-widest">Digital Archive v1.0</p>
            </div>
          </div>

          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Search by title or author..." 
              className="pl-10 bg-muted/50 border-border/50 focus:bg-muted transition-colors"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Info className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16 relative">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <Badge variant="outline" className="mb-4 border-primary/30 text-primary bg-primary/5 px-3 py-1 font-mono text-[10px] uppercase tracking-widest">
                <Sparkles className="w-3 h-3 mr-1" /> Curated Collection
              </Badge>
              <h2 className="text-5xl md:text-7xl font-heading font-bold mb-6 max-w-3xl leading-[1.05] text-foreground">
                The <span className="text-primary italic">Philosophical</span> Frontier: A Digital Archive of Speculative Thought
              </h2>
              <p className="text-muted-foreground text-lg max-w-xl leading-relaxed mb-8">
                Welcome to a curated repository of 80 mind-bending masterpieces. This archive serves as a gateway to the intersection of hard science, speculative fiction, and deep existential inquiry. From the ethics of artificial intelligence to the vast sociology of the cosmos, explore the works that challenge our understanding of reality and the human condition.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-8 h-12 shadow-lg shadow-primary/20">
                  Start Exploring
                </Button>
                <Button variant="outline" className="rounded-full px-8 h-12 border-border/50 hover:bg-accent/10 bg-background/50">
                  View Archive
                </Button>
              </div>
            </div>

            {/* Featured Book Highlight */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="relative group"
            >
              <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-3xl group-hover:bg-primary/10 transition-all duration-500" />
                <Card className="relative bg-card/80 border-primary/20 backdrop-blur-xl overflow-hidden cursor-pointer shadow-xl shadow-primary/5 flex flex-col md:flex-row" onClick={() => setSelectedBook(featuredBook)}>
                  <div className="w-full md:w-1/3 aspect-[2/3] relative overflow-hidden">
                    <img 
                      src={featuredBook.coverImageUrl} 
                      alt={featuredBook.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-card/20 to-transparent" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="absolute top-0 right-0 p-4">
                      <Badge className="bg-primary text-primary-foreground font-mono text-[10px] uppercase tracking-widest">
                        Featured Archive
                      </Badge>
                    </div>
                    <CardHeader className="pt-12">
                      <CardDescription className="font-mono text-xs text-primary uppercase tracking-widest mb-2 font-bold">
                        {featuredBook.category}
                      </CardDescription>
                      <CardTitle className="text-3xl font-heading font-bold mb-2 text-foreground">
                        {featuredBook.title}
                      </CardTitle>
                      <CardDescription className="text-lg font-medium text-foreground/70">
                        {featuredBook.author}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="flex-1">
                      <p className="text-muted-foreground line-clamp-3 mb-6 italic">
                        "{featuredBook.synopsis}"
                      </p>
                      <div className="flex items-center gap-4">
                        <Button variant="link" className="p-0 text-primary flex items-center gap-2 group/btn font-bold">
                          Read More <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
            </motion.div>
          </div>
        </section>

        {/* Controls Bar */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8 border-y border-border/20 py-6">
          <div className="overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-hide">
            <Tabs value={activeCategory} onValueChange={setActiveCategory} className="w-full">
              <TabsList className="bg-transparent h-auto flex gap-2 p-0">
                {CATEGORIES.map((cat) => (
                  <TabsTrigger 
                    key={cat} 
                    value={cat}
                    className="px-4 py-2 text-xs font-medium border border-transparent data-[state=active]:border-primary/30 data-[state=active]:bg-primary/10 data-[state=active]:text-primary transition-all rounded-full"
                  >
                    {cat}
                    {cat === "Reading List" && favorites.length > 0 && (
                      <Badge className="ml-2 h-4 w-4 p-0 flex items-center justify-center text-[10px] bg-primary text-primary-foreground">
                        {favorites.length}
                      </Badge>
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <div className="flex items-center gap-2 bg-muted/30 p-1 rounded-lg border border-border/50">
            <Button 
              variant={viewMode === "grid" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-md"
              onClick={() => setViewMode("grid")}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button 
              variant={viewMode === "list" ? "secondary" : "ghost"} 
              size="icon" 
              className="h-8 w-8 rounded-md"
              onClick={() => setViewMode("list")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Book Grid/List */}
        <div className={cn(
          "grid gap-6",
          viewMode === "grid" 
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" 
            : "grid-cols-1"
        )}>
          <AnimatePresence mode="popLayout">
            {filteredBooks.map((book, index) => (
              <motion.div
                key={book.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3, delay: index * 0.02 }}
                onClick={() => setSelectedBook(book)}
                className="cursor-pointer group"
              >
                <Card className={cn(
                  "bg-card/80 border-border/50 hover:border-primary/50 hover:bg-accent/5 transition-all duration-300 overflow-hidden relative shadow-sm hover:shadow-md",
                  viewMode === "list" && "flex flex-row items-center"
                )}>
                  {/* Favorite Button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "absolute top-2 right-2 z-10 rounded-full hover:bg-primary/10",
                      favorites.includes(book.id) ? "text-primary" : "text-muted-foreground opacity-0 group-hover:opacity-100"
                    )}
                    onClick={(e) => toggleFavorite(e, book.id)}
                  >
                    <Bookmark className={cn("w-4 h-4", favorites.includes(book.id) && "fill-current")} />
                  </Button>

                  {viewMode === "grid" ? (
                    <>
                      <div className="aspect-[3/4] relative overflow-hidden">
                        <img 
                          src={book.coverImageUrl} 
                          alt={book.title}
                          className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-110"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardHeader className="pb-2">
                        <div className="flex items-start justify-between mb-2">
                          <span className="font-mono text-[10px] text-muted-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                            #{String(book.id).padStart(2, '0')}
                          </span>
                          {book.isFeatured && (
                            <Star className="w-3 h-3 text-primary fill-current" />
                          )}
                        </div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2 min-h-[3.5rem] leading-tight">
                          {book.title}
                        </CardTitle>
                        <CardDescription className="font-medium text-foreground/80">
                          {book.author}
                        </CardDescription>
                      </CardHeader>
                      
                      <CardContent className="pt-0">
                        <div className="flex flex-col gap-4">
                          <div className="flex flex-wrap gap-1">
                            {book.tags?.map(tag => (
                              <Badge key={tag} variant="outline" className="text-[9px] font-mono py-0 h-4 border-primary/20 text-primary/70">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          
                          <div className="flex items-center justify-between mt-2">
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground font-mono uppercase tracking-wider">
                              <Filter className="w-3 h-3" />
                              {book.category.split(' ')[0]}
                            </div>
                            <span className="text-[10px] font-mono text-muted-foreground">{book.year}</span>
                          </div>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <div className="flex items-center w-full px-6 py-4 gap-6">
                      <div className="w-12 h-16 rounded overflow-hidden flex-shrink-0 border border-border/50">
                        <img 
                          src={book.coverImageUrl} 
                          alt={book.title}
                          className="object-cover w-full h-full"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <span className="font-mono text-xs text-muted-foreground w-8">
                        #{String(book.id).padStart(2, '0')}
                      </span>
                      <div className="flex-1">
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {book.title}
                        </CardTitle>
                        <CardDescription className="font-medium">
                          {book.author}
                        </CardDescription>
                      </div>
                      <div className="hidden md:flex flex-wrap gap-1 max-w-[200px]">
                        {book.tags?.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-[9px] font-mono border-primary/20 text-primary/70">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="hidden lg:block text-xs font-mono text-muted-foreground w-32">
                        {book.category}
                      </div>
                      <div className="text-xs font-mono text-muted-foreground w-12">
                        {book.year}
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </div>
                  )}
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredBooks.length === 0 && (
          <div className="py-20 text-center">
            <div className="w-16 h-16 bg-muted/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-border/50">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-heading font-bold mb-2">No books found</h3>
            <p className="text-muted-foreground">Try adjusting your search or filter to find what you're looking for.</p>
            <Button 
              variant="link" 
              className="mt-4 text-primary"
              onClick={() => {
                setSearchQuery("");
                setActiveCategory("All");
              }}
            >
              Clear all filters
            </Button>
          </div>
        )}

        {/* Book Detail Modal */}
        <Dialog open={!!selectedBook} onOpenChange={(open) => !open && setSelectedBook(null)}>
          <DialogContent className="sm:max-w-[600px] bg-card border-border/50 backdrop-blur-2xl">
            {selectedBook && (
              <>
                <DialogHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="outline" className="font-mono text-[10px] uppercase tracking-widest border-primary/30 text-primary">
                      {selectedBook.category}
                    </Badge>
                    {selectedBook.year && (
                      <Badge variant="secondary" className="font-mono text-[10px] flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {selectedBook.year}
                      </Badge>
                    )}
                  </div>
                  <DialogTitle className="text-3xl font-heading font-bold leading-tight">
                    {selectedBook.title}
                  </DialogTitle>
                  <DialogDescription className="text-lg font-medium text-foreground/80">
                    by {selectedBook.author}
                  </DialogDescription>
                </DialogHeader>

                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-1">
                    <div className="aspect-[2/3] rounded-xl overflow-hidden border border-border/50 shadow-lg">
                      <img 
                        src={selectedBook.coverImageUrl} 
                        alt={selectedBook.title}
                        className="object-cover w-full h-full"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                  </div>
                  
                  <div className="md:col-span-2 space-y-6">
                    <div className="flex flex-wrap gap-2">
                      {selectedBook.tags?.map(tag => (
                        <Badge key={tag} variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="relative p-6 rounded-xl bg-muted/20 border border-border/50">
                      <Quote className="absolute top-4 left-4 w-12 h-12 text-primary/5 -z-10" />
                      <p className="text-muted-foreground leading-relaxed italic text-lg">
                        {selectedBook.synopsis || "Synopsis coming soon to the digital archive..."}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-3 pt-4 border-t border-border/40">
                      <Button asChild className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 h-12 rounded-lg">
                        <a href={selectedBook.youtubeUrl} target="_blank" rel="noopener noreferrer">
                          <Youtube className="w-5 h-5 mr-2" /> Watch Analysis
                        </a>
                      </Button>
                      <Button variant="outline" className="w-12 h-12 p-0 border-border/50 hover:bg-accent/10 rounded-lg">
                        <Share2 className="w-5 h-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </main>

      {/* Expanded Archive Information Section */}
      <section className="py-24 border-t border-border/40 bg-muted/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <Badge variant="outline" className="text-primary border-primary/30">Mission Statement</Badge>
              <h3 className="text-4xl font-heading font-bold leading-tight">
                Preserving the <span className="text-primary italic">Intellectual Legacy</span> of Speculative Fiction
              </h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                The Philosophical Sci-Fi Archive is more than just a list of books; it is a curated gateway into the most profound questions humanity has ever asked. By documenting works that push the boundaries of science, ethics, and sociology, we aim to foster a deeper appreciation for the genre's ability to act as a laboratory for the human condition.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Whether exploring the cold equations of deep space or the fluid boundaries of digital consciousness, these masterpieces serve as essential maps for navigating our rapidly changing future.
              </p>
              <div className="flex gap-8 pt-4">
                <div>
                  <div className="text-3xl font-heading font-bold text-primary">80</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Masterpieces</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold text-primary">12+</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Categories</div>
                </div>
                <div>
                  <div className="text-3xl font-heading font-bold text-primary">∞</div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground font-mono">Inquiry</div>
                </div>
              </div>
            </div>
            <div className="relative aspect-square rounded-3xl overflow-hidden border border-border/50 shadow-2xl">
              <img 
                src="https://picsum.photos/seed/library/800/800" 
                alt="Digital Archive" 
                className="object-cover w-full h-full opacity-80 grayscale hover:grayscale-0 transition-all duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
              <div className="absolute bottom-8 left-8 right-8">
                <div className="p-6 rounded-2xl bg-card/90 backdrop-blur-md border border-border/50">
                  <p className="text-sm italic text-muted-foreground">
                    "Science fiction is the most important genre there is, for it is the only genre that explicitly addresses the change that is the most important fact of our lives."
                  </p>
                  <p className="text-xs font-bold mt-3 text-primary uppercase tracking-widest">— Isaac Asimov</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/40 py-12 bg-muted/10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <LibraryIcon className="w-6 h-6 text-primary" />
              <span className="font-heading font-bold text-lg">Sci-Fi Philosophy</span>
            </div>
            
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground font-mono uppercase tracking-widest">
              <a href="#" className="hover:text-primary transition-colors">Archive</a>
              <a href="#" className="hover:text-primary transition-colors">About</a>
              <a href="#" className="hover:text-primary transition-colors">Contact</a>
            </div>

            <div className="text-xs text-muted-foreground font-mono">
              &copy; 2026 Digital Archive. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

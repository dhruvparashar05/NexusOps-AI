"use client";

import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export interface GameEvent {
  id: string;
  title: string;
  status: "Live" | "Upcoming" | "Completed";
  date: string;
  time: string;
  teams: string;
  format: string;
  color: string;
  logo: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  isSchedule?: boolean;
  isReport?: boolean;
  isRuleCheck?: boolean;
  isModerator?: boolean;
}

export interface UserProfile {
  id: string;
  user_id?: string;
  name: string;
  organization_name: string;
  email: string;
  avatar_url?: string;
}

interface Toast {
  id: string;
  text: string;
}

interface DashboardContextType {
  isMounted: boolean;
  sidebarTab: string;
  setSidebarTab: (tab: string) => void;
  userProfile: UserProfile | null;
  loadingProfile: boolean;
  logout: () => Promise<void>;
  
  // Toasts
  toasts: Toast[];
  addToast: (text: string) => void;
  
  // Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
  
  // Smart Search
  smartSearchInput: string;
  setSmartSearchInput: (input: string) => void;
  smartSearchResult: string | null;
  setSmartSearchResult: (result: string | null) => void;
  isSmartSearching: boolean;
  smartSearchQueryTitle: string;
  handleSmartSearch: (overrideQuery?: string) => Promise<void>;
  
  // Teams
  selectedEventForTeams: GameEvent | null;
  setSelectedEventForTeams: (evt: GameEvent | null) => void;
  isTeamsModalOpen: boolean;
  setIsTeamsModalOpen: (open: boolean) => void;
  newTeamName: string;
  setNewTeamName: (name: string) => void;
  newTeamNumber: string;
  setNewTeamNumber: (num: string) => void;
  eventTeams: Record<string, { id: string; name: string; number: string }[]>;
  handleAddTeam: (e: React.FormEvent) => void;
  handleDeleteTeam: (teamId: string) => void;
  
  // Document Intelligence
  meetingInputType: "pdf" | "text";
  setMeetingInputType: (type: "pdf" | "text") => void;
  meetingText: string;
  setMeetingText: (text: string) => void;
  uploadedPdfFile: File | null;
  setUploadedPdfFile: (file: File | null) => void;
  isProcessingMeeting: boolean;
  meetingProcessingStep: string;
  isDragOver: boolean;
  setIsDragOver: (drag: boolean) => void;
  activeResultTab: "summary" | "actions" | "transcript";
  setActiveResultTab: (tab: "summary" | "actions" | "transcript") => void;
  meetingResult: {
    transcript: string;
    summary: string;
    actionItems: { id: string; text: string; assignee: string; priority: string; completed: boolean }[];
    details: { label: string; value: string }[];
    warning?: string;
  } | null;
  setMeetingResult: React.Dispatch<React.SetStateAction<any | null>>;
  processMeetingIntel: () => Promise<void>;
  toggleActionItem: (id: string) => void;
  
  // Stats
  totalParticipants: number;
  setTotalParticipants: React.Dispatch<React.SetStateAction<number>>;
  upcomingEventsCount: number;
  setUpcomingEventsCount: React.Dispatch<React.SetStateAction<number>>;
  activeTournamentsCount: number;
  setActiveTournamentsCount: React.Dispatch<React.SetStateAction<number>>;
  announcementsCount: number;
  donutData: { name: string; value: number; color: string }[];
  setDonutData: React.Dispatch<React.SetStateAction<{ name: string; value: number; color: string }[]>>;
  currentDate: string;
  
  // Events
  events: GameEvent[];
  setEvents: React.Dispatch<React.SetStateAction<GameEvent[]>>;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  newEventTitle: string;
  setNewEventTitle: (title: string) => void;
  newEventGame: string;
  setNewEventGame: (game: string) => void;
  newEventDate: string;
  setNewEventDate: (date: string) => void;
  newEventTime: string;
  setNewEventTime: (time: string) => void;
  newEventTeams: string;
  setNewEventTeams: (teams: string) => void;
  newEventFormat: string;
  setNewEventFormat: (format: string) => void;
  handleCreateEvent: (e: React.FormEvent) => void;
  handleDeleteEvent: (eventId: string) => void;
  
  // Copilot Chat
  chatMessages: ChatMessage[];
  setChatMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  chatInput: string;
  setChatInput: (input: string) => void;
  isAiTyping: boolean;
  chatBottomRef: React.RefObject<HTMLDivElement | null>;
  handleSendMessage: (e?: React.FormEvent, customText?: string, actionType?: string) => void;
  triggerPresetPrompt: (presetName: string, actionType: string) => void;
  
  // Activity / Announcements
  activity: { id: string; text: string; time: string; type: string }[];
  setActivity: React.Dispatch<React.SetStateAction<{ id: string; text: string; time: string; type: string }[]>>;
  announcements: {
    id: string;
    title: string;
    body: string;
    text: string;
    date: string;
    time: string;
    creator: string;
    code: string;
    emoji: string;
  }[];
  setAnnouncements: React.Dispatch<React.SetStateAction<any[]>>;
  
  // Helpers
  getEventStats: (evt: GameEvent) => { total: number; ytSubscribed: number; discordJoined: number };
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const supabase = createClient();
  
  const [isMounted, setIsMounted] = useState(false);
  const [sidebarTab, setSidebarTab] = useState("overview");
  
  // Auth state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  const isDemoMode = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === "https://placeholder-project.supabase.co";

  // Load User Profile from Supabase
  useEffect(() => {
    async function loadProfile() {
      try {
        if (isDemoMode) {
          const cookieMatch = typeof document !== "undefined" && document.cookie.match(/sb-demo-session=([^;]+)/);
          if (cookieMatch) {
            try {
              const u = JSON.parse(decodeURIComponent(cookieMatch[1]));
              setUserProfile({
                id: u.id || "demo-user-id",
                user_id: u.id || "demo-user-id",
                name: u.user_metadata?.name || "Demo Admin",
                organization_name: u.user_metadata?.organization_name || "NexusOps Hub",
                email: u.email || "admin@nexusops.com"
              });
            } catch {
              setUserProfile({
                id: "demo-user-id",
                user_id: "demo-user-id",
                name: "Demo Admin",
                organization_name: "NexusOps Hub",
                email: "admin@nexusops.com"
              });
            }
          }
        } else {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            const { data: profileData } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", user.id)
              .single();

            let finalProfile = profileData;
            if (!profileData) {
              finalProfile = {
                id: user.id,
                user_id: user.id,
                name: user.user_metadata?.name || user.email?.split("@")[0] || "Admin",
                organization_name: user.user_metadata?.organization_name || "NexusOps Hub",
                email: user.email || "",
              };
            } else {
              finalProfile = {
                ...profileData,
                user_id: profileData.user_id || user.id,
              };
            }
            setUserProfile(finalProfile);

            // Now query events from Supabase
            const { data: dbEvents } = await supabase
              .from("events")
              .select("*")
              .order("created_at", { ascending: false });

            if (dbEvents && dbEvents.length > 0) {
              setEvents(dbEvents as GameEvent[]);

              // Query teams for these events
              const eventIds = dbEvents.map(e => e.id);
              const { data: dbTeams } = await supabase
                .from("event_teams")
                .select("*")
                .in("event_id", eventIds);

              if (dbTeams) {
                const teamsMap: Record<string, { id: string; name: string; number: string }[]> = {};
                dbTeams.forEach(t => {
                  if (!teamsMap[t.event_id]) {
                    teamsMap[t.event_id] = [];
                  }
                  teamsMap[t.event_id].push({
                    id: t.id,
                    name: t.name,
                    number: t.number
                  });
                });
                setEventTeams(teamsMap);
              }
            } else {
              // Seed default events into database
              const defaultEventsList: GameEvent[] = [
                {
                  id: "val-arena",
                  title: "Valorant Arena Cup",
                  status: "Live",
                  date: "May 21, 2026",
                  time: "08:00 PM",
                  teams: "128 Teams",
                  format: "Single Elimination",
                  color: "from-red-600/30 to-zinc-900",
                  logo: "valorant"
                },
                {
                  id: "bgmi-campus",
                  title: "BGMI Campus Clash",
                  status: "Upcoming",
                  date: "May 24, 2026",
                  time: "06:00 PM",
                  teams: "64 Teams",
                  format: "Squad Mode",
                  color: "from-amber-600/20 to-zinc-900",
                  logo: "bgmi"
                },
                {
                  id: "clash-colleges",
                  title: "Clash of Colleges",
                  status: "Upcoming",
                  date: "May 28, 2026",
                  time: "07:00 PM",
                  teams: "32 Teams",
                  format: "5v5",
                  color: "from-indigo-600/20 to-zinc-900",
                  logo: "clash"
                },
                {
                  id: "ff-showdown",
                  title: "Free Fire Showdown",
                  status: "Upcoming",
                  date: "Jun 02, 2026",
                  time: "05:00 PM",
                  teams: "48 Teams",
                  format: "Squad Mode",
                  color: "from-orange-600/20 to-zinc-900",
                  logo: "freefire"
                }
              ];

              const eventsToInsert = defaultEventsList.map(e => ({
                title: e.title,
                status: e.status,
                date: e.date,
                time: e.time,
                teams: e.teams,
                format: e.format,
                color: e.color,
                logo: e.logo,
                user_id: user.id
              }));

              const { data: insertedEvents } = await supabase
                .from("events")
                .insert(eventsToInsert)
                .select();

              if (insertedEvents) {
                setEvents(insertedEvents as GameEvent[]);
                
                // Seed initial teams matching default list
                const defaultTeamsToInsert: { event_id: string; name: string; number: string }[] = [];
                insertedEvents.forEach(evt => {
                  if (evt.logo === "valorant") {
                    defaultTeamsToInsert.push(
                      { event_id: evt.id, name: "Sentinels", number: "1" },
                      { event_id: evt.id, name: "Fnatic", number: "2" },
                      { event_id: evt.id, name: "Paper Rex", number: "3" },
                      { event_id: evt.id, name: "Team Heretics", number: "4" }
                    );
                  } else if (evt.logo === "bgmi") {
                    defaultTeamsToInsert.push(
                      { event_id: evt.id, name: "Team Soul", number: "1" },
                      { event_id: evt.id, name: "GodLike Esports", number: "2" },
                      { event_id: evt.id, name: "Global Esports", number: "3" }
                    );
                  } else if (evt.logo === "clash") {
                    defaultTeamsToInsert.push(
                      { event_id: evt.id, name: "Indian Clashers", number: "1" },
                      { event_id: evt.id, name: "Alpha Stars", number: "2" }
                    );
                  } else if (evt.logo === "freefire") {
                    defaultTeamsToInsert.push(
                      { event_id: evt.id, name: "Total Gaming", number: "1" },
                      { event_id: evt.id, name: "Orangutan Elite", number: "2" }
                    );
                  }
                });

                const { data: insertedTeams } = await supabase
                  .from("event_teams")
                  .insert(defaultTeamsToInsert)
                  .select();

                if (insertedTeams) {
                  const teamsMap: Record<string, { id: string; name: string; number: string }[]> = {};
                  insertedTeams.forEach(t => {
                    if (!teamsMap[t.event_id]) {
                      teamsMap[t.event_id] = [];
                    }
                    teamsMap[t.event_id].push({
                      id: t.id,
                      name: t.name,
                      number: t.number
                    });
                  });
                  setEventTeams(teamsMap);
                }
              }
            }

            // Now query announcements from Supabase
            const { data: dbAnnouncements } = await supabase
              .from("announcements")
              .select("*")
              .order("created_at", { ascending: false });

            if (dbAnnouncements && dbAnnouncements.length > 0) {
              setAnnouncements(dbAnnouncements);
              setAnnouncementsCount(dbAnnouncements.length);
            } else {
              // Seed default announcements
              const today = new Date();
              const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
              const shortFormatted = `${shortMonths[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

              const defaultAnnouncementsList = [
                {
                  title: "Valorant Arena Cup starts tomorrow!",
                  body: "Referees have finished setting up match channels. Please ensure all team captains have logged their rosters by 07:00 PM IST today to prevent sudden-death default forfeits.",
                  text: "Don't forget to join by 7:30 PM. All the best!",
                  date: shortFormatted,
                  time: "10:30 AM",
                  creator: finalProfile?.name || "Aditya Verma",
                  code: "discord",
                  emoji: "🎮",
                  user_id: user.id
                },
                {
                  title: "Important Rules Update",
                  body: "Substitute restrictions updated. Max 2 subs are permitted per squad. The referee must approve sub replacements 2 hours prior to lobby launch.",
                  text: "Please check the updated rulebook for all events.",
                  date: "May 18, 2026",
                  time: "06:45 PM",
                  creator: "AI Copilot System",
                  code: "all",
                  emoji: "📢",
                  user_id: user.id
                },
                {
                  title: "BGMI Campus Clash Prize Pool Breakdown",
                  body: "First Place: ₹25,000 + Champion Medal. Second Place: ₹15,000. MVP Award: ₹10,000. Registration closes when lobbies fill completely.",
                  text: "Total prize pool of ₹50,000. Register now!",
                  date: "May 17, 2026",
                  time: "09:15 PM",
                  creator: finalProfile?.name || "Aditya Verma",
                  code: "telegram",
                  emoji: "🏆",
                  user_id: user.id
                }
              ];

              const { data: insertedAnnouncements } = await supabase
                .from("announcements")
                .insert(defaultAnnouncementsList)
                .select();

              if (insertedAnnouncements) {
                setAnnouncements(insertedAnnouncements);
                setAnnouncementsCount(insertedAnnouncements.length);
              }
            }
          }
        }
      } catch (err) {
        console.error("Error loading user profile", err);
      } finally {
        setLoadingProfile(false);
      }
    }
    loadProfile();
  }, []);

  const logout = async () => {
    if (isDemoMode) {
      if (typeof document !== "undefined") {
        document.cookie = "sb-demo-session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
      }
    } else {
      await supabase.auth.signOut();
    }
    setUserProfile(null);
    router.refresh();
    window.location.href = "/login";
  };

  // General Dashboard States
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const [smartSearchInput, setSmartSearchInput] = useState("");
  const [smartSearchResult, setSmartSearchResult] = useState<string | null>(null);
  const [isSmartSearching, setIsSmartSearching] = useState(false);
  const [smartSearchQueryTitle, setSmartSearchQueryTitle] = useState("");

  const [selectedEventForTeams, setSelectedEventForTeams] = useState<GameEvent | null>(null);
  const [isTeamsModalOpen, setIsTeamsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamNumber, setNewTeamNumber] = useState("");

  // Teams mapping
  const [eventTeams, setEventTeams] = useState<Record<string, { id: string; name: string; number: string }[]>>({
    "val-arena": [
      { id: "t1", name: "Sentinels", number: "1" },
      { id: "t2", name: "Fnatic", number: "2" },
      { id: "t3", name: "Paper Rex", number: "3" },
      { id: "t4", name: "Team Heretics", number: "4" }
    ],
    "bgmi-campus": [
      { id: "t1", name: "Team Soul", number: "1" },
      { id: "t2", name: "GodLike Esports", number: "2" },
      { id: "t3", name: "Global Esports", number: "3" }
    ],
    "clash-colleges": [
      { id: "t1", name: "Indian Clashers", number: "1" },
      { id: "t2", name: "Alpha Stars", number: "2" }
    ],
    "ff-showdown": [
      { id: "t1", name: "Total Gaming", number: "1" },
      { id: "t2", name: "Orangutan Elite", number: "2" }
    ]
  });

  // Date and stats
  const [currentDate, setCurrentDate] = useState("May 20, 2026");
  const [totalParticipants, setTotalParticipants] = useState(1248);
  const [upcomingEventsCount, setUpcomingEventsCount] = useState(7);
  const [activeTournamentsCount, setActiveTournamentsCount] = useState(4);
  const [announcementsCount, setAnnouncementsCount] = useState(3);

  const [donutData, setDonutData] = useState([
    { name: "Upcoming", value: 7, color: "#3B82F6" },
    { name: "Live", value: 4, color: "#10B981" },
    { name: "Completed", value: 3, color: "#7C3AED" },
    { name: "Cancelled", value: 4, color: "#EF4444" }
  ]);

  // Events list
  const [events, setEvents] = useState<GameEvent[]>([
    {
      id: "val-arena",
      title: "Valorant Arena Cup",
      status: "Live",
      date: "May 21, 2026",
      time: "08:00 PM",
      teams: "128 Teams",
      format: "Single Elimination",
      color: "from-red-600/30 to-zinc-900",
      logo: "valorant"
    },
    {
      id: "bgmi-campus",
      title: "BGMI Campus Clash",
      status: "Upcoming",
      date: "May 24, 2026",
      time: "06:00 PM",
      teams: "64 Teams",
      format: "Squad Mode",
      color: "from-amber-600/20 to-zinc-900",
      logo: "bgmi"
    },
    {
      id: "clash-colleges",
      title: "Clash of Colleges",
      status: "Upcoming",
      date: "May 28, 2026",
      time: "07:00 PM",
      teams: "32 Teams",
      format: "5v5",
      color: "from-indigo-600/20 to-zinc-900",
      logo: "clash"
    },
    {
      id: "ff-showdown",
      title: "Free Fire Showdown",
      status: "Upcoming",
      date: "Jun 02, 2026",
      time: "05:00 PM",
      teams: "48 Teams",
      format: "Squad Mode",
      color: "from-orange-600/20 to-zinc-900",
      logo: "freefire"
    }
  ]);

  // Create event modal form fields
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventGame, setNewEventGame] = useState("Valorant");
  const [newEventDate, setNewEventDate] = useState("2026-06-05");
  const [newEventTime, setNewEventTime] = useState("18:00");
  const [newEventTeams, setNewEventTeams] = useState("32");
  const [newEventFormat, setNewEventFormat] = useState("Single Elimination");

  // Document Intelligence states
  const [meetingInputType, setMeetingInputType] = useState<"pdf" | "text">("pdf");
  const [meetingText, setMeetingText] = useState("");
  const [uploadedPdfFile, setUploadedPdfFile] = useState<File | null>(null);
  const [isProcessingMeeting, setIsProcessingMeeting] = useState(false);
  const [meetingProcessingStep, setMeetingProcessingStep] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [activeResultTab, setActiveResultTab] = useState<"summary" | "actions" | "transcript">("summary");
  const [meetingResult, setMeetingResult] = useState<any | null>(null);

  // Copilot messages
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  // Activity feed & Announcements
  const [activity, setActivity] = useState([
    { id: "act-1", text: "Team Hydra registered for BGMI Campus Clash", time: "2 min ago", type: "register" },
    { id: "act-2", text: "New announcement created for Valorant Arena Cup", time: "15 min ago", type: "announcement" },
    { id: "act-3", text: "Meeting \"Organizer Sync\" summarized", time: "1 hour ago", type: "meeting" },
    { id: "act-4", text: "Rulebook updated for Free Fire Showdown", time: "2 hours ago", type: "rule" }
  ]);

  const [announcements, setAnnouncements] = useState([
    {
      id: "ann-1",
      title: "Valorant Arena Cup starts tomorrow!",
      body: "Referees have finished setting up match channels. Please ensure all team captains have logged their rosters by 07:00 PM IST today to prevent sudden-death default forfeits.",
      text: "Don't forget to join by 7:30 PM. All the best!",
      date: "May 20, 2026",
      time: "10:30 AM",
      creator: "Aditya Verma",
      code: "discord",
      emoji: "🎮"
    },
    {
      id: "ann-2",
      title: "Important Rules Update",
      body: "Substitute restrictions updated. Max 2 subs are permitted per squad. The referee must approve sub replacements 2 hours prior to lobby launch.",
      text: "Please check the updated rulebook for all events.",
      date: "May 18, 2026",
      time: "06:45 PM",
      creator: "AI Copilot System",
      code: "all",
      emoji: "📢"
    },
    {
      id: "ann-3",
      title: "BGMI Campus Clash Prize Pool Breakdown",
      body: "First Place: ₹25,000 + Champion Medal. Second Place: ₹15,000. MVP Award: ₹10,000. Registration closes when lobbies fill completely.",
      text: "Total prize pool of ₹50,000. Register now!",
      date: "May 17, 2026",
      time: "09:15 PM",
      creator: "Aditya Verma",
      code: "telegram",
      emoji: "🏆"
    }
  ]);

  // Initializing Mount state, date, and chat greeting
  useEffect(() => {
    setIsMounted(true);
    const date = new Date();
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const formatted = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    setCurrentDate(formatted);

    // Update first announcement date to today
    const shortMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const shortFormatted = `${shortMonths[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
    setAnnouncements((prev) =>
      prev.map((ann) => (ann.id === "ann-1" ? { ...ann, date: shortFormatted } : ann))
    );
  }, []);

  // Synchronize dashboard statistics and donut data reactively based on the events list
  useEffect(() => {
    const upcoming = events.filter((e) => e.status === "Upcoming").length;
    const live = events.filter((e) => e.status === "Live").length;
    const completed = events.filter((e) => e.status === "Completed").length;
    const cancelled = events.filter((e) => (e.status as string) === "Cancelled").length;

    setUpcomingEventsCount(upcoming);
    setActiveTournamentsCount(live);

    setDonutData([
      { name: "Upcoming", value: upcoming, color: "#3B82F6" },
      { name: "Live", value: live, color: "#10B981" },
      { name: "Completed", value: completed, color: "#7C3AED" },
      { name: "Cancelled", value: cancelled, color: "#EF4444" }
    ]);

    let totalParticipantsSum = 0;
    events.forEach((e) => {
      const teamCountMatch = e.teams.match(/(\d+)/);
      const teamsCount = teamCountMatch ? parseInt(teamCountMatch[1]) : 16;
      totalParticipantsSum += teamsCount * 5;
    });
    setTotalParticipants(totalParticipantsSum);
  }, [events]);

  // Sync Chat Greetings when userProfile loads
  useEffect(() => {
    if (!loadingProfile && userProfile) {
      const firstName = userProfile.name.trim().split(/\s+/)[0];
      setChatMessages([
        {
          id: "init",
          sender: "ai",
          text: `Hi ${firstName}! 👋\nHow can I assist with your community today?`,
          timestamp: "10:30 AM"
        }
      ]);
    }
  }, [loadingProfile, userProfile]);

  // Auto scroll chat
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const addToast = (text: string) => {
    const id = Math.random().toString();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const getEventStats = (evt: GameEvent) => {
    const teamCountMatch = evt.teams.match(/(\d+)/);
    const teamsCount = teamCountMatch ? parseInt(teamCountMatch[1]) : 16;
    const total = teamsCount * 5;
    
    let hash = 0;
    for (let i = 0; i < evt.title.length; i++) {
      hash = evt.title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const ytPercent = 60 + Math.abs(hash % 30);
    const discordPercent = 75 + Math.abs(hash % 20);
    
    const ytSubscribed = Math.min(total, Math.round((total * ytPercent) / 100));
    const discordJoined = Math.min(total, Math.round((total * discordPercent) / 100));
    
    return { total, ytSubscribed, discordJoined };
  };

  const handleAddTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEventForTeams) return;
    if (!newTeamName.trim() || !newTeamNumber.trim()) {
      addToast("⚠️ Team name and number are required!");
      return;
    }

    const currentTeams = eventTeams[selectedEventForTeams.id] || [];
    if (currentTeams.some(t => t.number === newTeamNumber.trim())) {
      addToast("⚠️ A team with this number already exists!");
      return;
    }

    if (!isDemoMode) {
      supabase.from("event_teams").insert({
        event_id: selectedEventForTeams.id,
        name: newTeamName.trim(),
        number: newTeamNumber.trim()
      }).select().single().then(({ data, error }) => {
        if (error) {
          console.error("Error adding team in Supabase:", error);
          addToast("❌ Failed to register team in database.");
        } else if (data) {
          const registered = {
            id: data.id,
            name: data.name,
            number: data.number
          };
          setEventTeams(prev => ({
            ...prev,
            [selectedEventForTeams.id]: [...(prev[selectedEventForTeams.id] || []), registered]
          }));
          addToast(`✅ Team "${registered.name}" saved to database!`);
        }
      });
      setNewTeamName("");
      setNewTeamNumber("");
      return;
    }

    const newTeam = {
      id: Math.random().toString(),
      name: newTeamName.trim(),
      number: newTeamNumber.trim()
    };

    setEventTeams(prev => ({
      ...prev,
      [selectedEventForTeams.id]: [...currentTeams, newTeam]
    }));

    setNewTeamName("");
    setNewTeamNumber("");
    addToast(`✅ Team "${newTeam.name}" registered successfully!`);
  };

  const handleDeleteTeam = (teamId: string) => {
    if (!selectedEventForTeams) return;
    const currentTeams = eventTeams[selectedEventForTeams.id] || [];
    const teamToDelete = currentTeams.find(t => t.id === teamId);
    if (!teamToDelete) return;

    if (!isDemoMode) {
      supabase.from("event_teams").delete().eq("id", teamId).then(({ error }) => {
        if (error) {
          console.error("Error deleting team from Supabase:", error);
          addToast("❌ Failed to remove team from database.");
        } else {
          setEventTeams(prev => ({
            ...prev,
            [selectedEventForTeams.id]: currentTeams.filter(t => t.id !== teamId)
          }));
          addToast(`🗑️ Removed team: "${teamToDelete.name}"`);
        }
      });
      return;
    }

    setEventTeams(prev => ({
      ...prev,
      [selectedEventForTeams.id]: currentTeams.filter(t => t.id !== teamId)
    }));

    addToast(`🗑️ Removed team: "${teamToDelete.name}"`);
  };

  const handleDeleteEvent = (eventId: string) => {
    const matchedEvent = events.find(e => e.id === eventId);
    if (!matchedEvent) return;

    const performDelete = () => {
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setActivity((prev) => [
        {
          id: Math.random().toString(),
          text: `Tournament "${matchedEvent.title}" deleted manually`,
          time: "Just now",
          type: "event_delete"
        },
        ...prev
      ]);
      addToast(`🗑️ Event "${matchedEvent.title}" deleted!`);
    };

    if (!isDemoMode) {
      supabase.from("events").delete().eq("id", eventId).then(({ error }) => {
        if (error) {
          console.error("Error deleting event in Supabase:", error);
          addToast("❌ Failed to delete event in database.");
        } else {
          performDelete();
        }
      });
    } else {
      performDelete();
    }
  };

  const processMeetingIntel = async () => {
    if (meetingInputType === "pdf" && !uploadedPdfFile) {
      addToast("⚠️ Please upload a PDF document first.");
      return;
    }
    if (meetingInputType === "text" && !meetingText.trim()) {
      addToast("⚠️ Please paste some meeting notes or paragraph first.");
      return;
    }

    setIsProcessingMeeting(true);
    setMeetingResult(null);

    const steps = meetingInputType === "pdf" 
      ? [
          "Opening PDF document stream...",
          "Parsing text nodes & analyzing document structure...",
          "Contacting AI model for semantic document indexing...",
          "Synthesizing summary, key metadata, and actionable tasks..."
        ]
      : [
          "Parsing pasted notes and doing lexical analysis...",
          "Identifying key participants and decision threads...",
          "Contacting Gemini for intent resolution...",
          "Synthesizing executive summary and action checklists..."
        ];

    for (let i = 0; i < steps.length; i++) {
      setMeetingProcessingStep(steps[i]);
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    try {
      const formData = new FormData();
      formData.append("type", meetingInputType);
      if (meetingInputType === "pdf" && uploadedPdfFile) {
        formData.append("file", uploadedPdfFile);
      } else {
        formData.append("text", meetingText);
      }

      const res = await fetch("/api/meeting", {
        method: "POST",
        body: formData
      });

      if (!res.ok) {
        throw new Error(`Server returned status ${res.status}`);
      }

      const data = await res.json();
      
      const mappedActionItems = (data.actionItems || []).map((item: any, idx: number) => ({
        ...item,
        id: `action-${idx}-${Date.now()}`,
        completed: false
      }));

      setMeetingResult({
        transcript: data.transcript || "",
        summary: data.summary || "",
        actionItems: mappedActionItems,
        details: data.details || [],
        warning: data.warning
      });

      if (data.warning) {
        addToast("✅ Analyzed (Offline Fallback mode activated)");
      } else {
        addToast("✨ Document analysis complete!");
      }

    } catch (err: any) {
      console.error(err);
      addToast("❌ Document analysis failed. Using offline backup.");
      
      const docName = meetingInputType === "pdf" ? uploadedPdfFile?.name || "document.pdf" : "Pasted Notes";
      setMeetingResult({
        transcript: `[Document Analysis Fallback] Document Name: ${docName}\n\nSection 1: General Setup\nEnsure brackets are updated for the upcoming tournament. ${userProfile?.name || "Admin"} is running operations.\n\nSection 2: Decisions\nWe will freeze team rosters by 7:00 PM today. Late submissions forfeit their slots.`,
        summary: `• Parsed document fallback content.\n• Highlighted bracket seeding and roster submission deadlines.`,
        actionItems: [
          { id: "act-fallback-1", text: "Validate bracket seedings and lock rosters", assignee: "Referee Team", priority: "High", completed: false },
          { id: "act-fallback-2", text: "Publish updated lobby rules on official channels", assignee: userProfile?.name || "Admin", priority: "Medium", completed: false }
        ],
        details: [
          { label: "Document Type", value: meetingInputType === "pdf" ? "PDF Document" : "Pasted Text Notes" },
          { label: "Detected Topic", value: "Tournament Operations Setup" },
          { label: "Analysis Engine", value: "Client-Side Fallback Engine" }
        ]
      });
    } finally {
      setIsProcessingMeeting(false);
      setMeetingProcessingStep("");
    }
  };

  const toggleActionItem = (id: string) => {
    if (!meetingResult) return;
    setMeetingResult((prev: any) => {
      if (!prev) return null;
      return {
        ...prev,
        actionItems: prev.actionItems.map((item: any) => 
          item.id === id ? { ...item, completed: !item.completed } : item
        )
      };
    });
  };

  const handleCreateEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;

    const dateObj = new Date(newEventDate);
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const formattedDate = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, "0")}, ${dateObj.getFullYear()}`;

    const [hours, minutes] = newEventTime.split(":");
    const ampm = Number(hours) >= 12 ? "PM" : "AM";
    const formattedHours = Number(hours) % 12 || 12;
    const formattedTime = `${String(formattedHours).padStart(2, "0")}:${minutes} ${ampm}`;

    let logoType = "valorant";
    let eventGradient = "from-red-600/30 to-zinc-900";
    if (newEventGame.toLowerCase().includes("bgmi") || newEventGame.toLowerCase().includes("pubg")) {
      logoType = "bgmi";
      eventGradient = "from-amber-600/20 to-zinc-900";
    } else if (newEventGame.toLowerCase().includes("clash") || newEventGame.toLowerCase().includes("coc")) {
      logoType = "clash";
      eventGradient = "from-indigo-600/20 to-zinc-900";
    } else if (newEventGame.toLowerCase().includes("free fire") || newEventGame.toLowerCase().includes("ff")) {
      logoType = "freefire";
      eventGradient = "from-orange-600/20 to-zinc-900";
    } else {
      logoType = "clash";
      eventGradient = "from-purple-600/20 to-zinc-900";
    }

    if (!isDemoMode && userProfile) {
      supabase.from("events").insert({
        title: newEventTitle,
        status: "Upcoming",
        date: formattedDate,
        time: formattedTime,
        teams: `${newEventTeams} Teams`,
        format: newEventFormat,
        color: eventGradient,
        logo: logoType,
        user_id: userProfile.user_id || userProfile.id
      }).select().single().then(({ data, error }) => {
        if (error) {
          console.error("Error creating event in Supabase:", error);
          addToast("❌ Failed to save event to database.");
        } else if (data) {
          const dbEvt = data as GameEvent;
          setEvents((prev) => [dbEvt, ...prev]);

          setActivity((prev) => [
            {
              id: Math.random().toString(),
              text: `New event "${newEventTitle}" initialized successfully`,
              time: "Just now",
              type: "event_create"
            },
            ...prev
          ]);
          addToast(`🚀 Tournament "${newEventTitle}" saved to database!`);
        }
      });
      setIsCreateModalOpen(false);
      setNewEventTitle("");
      return;
    }

    const createdEvent: GameEvent = {
      id: Math.random().toString(),
      title: newEventTitle,
      status: "Upcoming",
      date: formattedDate,
      time: formattedTime,
      teams: `${newEventTeams} Teams`,
      format: newEventFormat,
      color: eventGradient,
      logo: logoType
    };

    setEvents((prev) => [createdEvent, ...prev]);

    setActivity((prev) => [
      {
        id: Math.random().toString(),
        text: `New event "${newEventTitle}" initialized successfully`,
        time: "Just now",
        type: "event_create"
      },
      ...prev
    ]);

    setIsCreateModalOpen(false);
    addToast(`🚀 Tournament "${newEventTitle}" created successfully!`);
    setNewEventTitle("");
  };

  const handleSmartSearch = async (overrideQuery?: string) => {
    const query = overrideQuery || smartSearchInput;
    if (!query.trim()) return;

    setIsSmartSearching(true);
    setSmartSearchQueryTitle(query);
    addToast("🔍 Scanning database & rulebooks...");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: query }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      const replyText = data.replyText || "No matching references found in the database.";
      setSmartSearchResult(replyText);
      addToast("✨ Database scanning complete!");
    } catch (err: any) {
      console.error(err);
      setSmartSearchResult(`❌ **Search Error:** Failed to fetch securely from database indexes.\nDetail: ${err?.message || err}`);
      addToast("❌ Database scan failed.");
    } finally {
      setIsSmartSearching(false);
    }
  };

  const simulateAiResponse = async (userPrompt: string, actionType: string) => {
    setIsAiTyping(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userPrompt }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      let isSchedule = false;
      let isReport = false;
      let isRuleCheck = false;
      let isModerator = false;

      const action = data.action;
      const params = data.parameters || {};
      const replyText = data.replyText || "I've registered your query.";

      const lowercasePrompt = userPrompt.toLowerCase();
      const isRuleSearchQuery =
        lowercasePrompt.includes("summarize") ||
        lowercasePrompt.includes("rulebook") ||
        lowercasePrompt.includes("rules pdf") ||
        lowercasePrompt.includes("section") ||
        lowercasePrompt.includes("rules of") ||
        lowercasePrompt.includes("rules for") ||
        replyText.toLowerCase().includes("section");

      if (isRuleSearchQuery) {
        setSidebarTab("search");
        setSmartSearchInput(userPrompt);
        setSmartSearchResult(replyText);
        setSmartSearchQueryTitle(userPrompt);
        isRuleCheck = true;
        addToast("🔍 Rulebook scan loaded in Smart Search tab!");
      }

      if (action === "NAVIGATE_TAB" && params.targetTab) {
        const dest = params.targetTab;
        if (dest === "analytics") {
          router.push("/analytics");
          addToast("📊 Opened Analytics Console");
        } else if (dest === "tournaments" || dest === "events") {
          router.push("/tournaments");
          addToast("🏆 Switched to Tournaments tab");
        } else if (dest === "communities") {
          router.push("/communities");
          addToast("👥 Switched to Communities integrations");
        } else if (dest === "dashboard" || dest === "home" || dest === "overview") {
          router.push("/dashboard");
          setSidebarTab("overview");
          addToast("🏠 Opened Dashboard Home");
        } else if (dest === "announcements") {
          router.push("/dashboard");
          setSidebarTab("announcements");
          addToast("📣 Opened Announcements view");
        }
      }
      else if (action === "SEARCH_EVENTS" && params.searchQuery) {
        setSearchQuery(params.searchQuery);
        addToast(`🔍 Dashboard filtered for: "${params.searchQuery}"`);
      }
      else if (action === "CLEAR_FILTER") {
        setSearchQuery("");
        addToast("✨ Search filters cleared!");
      }
      else if (action === "CREATE_EVENT" && params.eventTitle) {
        const cleanTitle = params.eventTitle;
        const game = params.eventGame || "valorant";
        const teams = params.eventTeams || 16;

        let logoType = "clash";
        let eventGradient = "from-purple-600/20 to-zinc-900";
        if (game === "valorant") {
          logoType = "valorant";
          eventGradient = "from-red-600/30 to-zinc-900";
        } else if (game === "bgmi") {
          logoType = "bgmi";
          eventGradient = "from-amber-600/20 to-zinc-900";
        } else if (game === "clash") {
          logoType = "clash";
          eventGradient = "from-indigo-600/20 to-zinc-900";
        } else if (game === "freefire") {
          logoType = "freefire";
          eventGradient = "from-orange-600/20 to-zinc-900";
        }

        const dateObj = new Date();
        dateObj.setDate(dateObj.getDate() + 5);
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, "0")}, ${dateObj.getFullYear()}`;

        if (!isDemoMode && userProfile) {
          supabase.from("events").insert({
            title: cleanTitle,
            status: "Upcoming",
            date: formattedDate,
            time: "07:00 PM",
            teams: `${teams} Teams`,
            format: "Squad Mode",
            color: eventGradient,
            logo: logoType,
            user_id: userProfile.user_id || userProfile.id
          }).select().single().then(({ data, error }) => {
            if (error) {
              console.error("Error creating AI event in Supabase:", error);
            } else if (data) {
              const dbEvt = data as GameEvent;
              setEvents((prev) => [dbEvt, ...prev]);
              setActivity((prev) => [
                {
                  id: Math.random().toString(),
                  text: `Event "${cleanTitle}" created by AI Copilot Command`,
                  time: "Just now",
                  type: "event_create"
                },
                ...prev
              ]);
              addToast(`🚀 Tournament "${cleanTitle}" saved to database!`);
            }
          });
        } else {
          const createdEvent: GameEvent = {
            id: Math.random().toString(),
            title: cleanTitle,
            status: "Upcoming",
            date: formattedDate,
            time: "07:00 PM",
            teams: `${teams} Teams`,
            format: "Squad Mode",
            color: eventGradient,
            logo: logoType
          };

          setEvents((prev) => [createdEvent, ...prev]);
          setActivity((prev) => [
            {
              id: Math.random().toString(),
              text: `Event "${cleanTitle}" created by AI Copilot Command`,
              time: "Just now",
              type: "event_create"
            },
            ...prev
          ]);
        }
        addToast(`🚀 Tournament "${cleanTitle}" created!`);
      }
      else if (action === "CANCEL_EVENT" && params.eventTitle) {
        const term = params.eventTitle.toLowerCase();
        const matchIdx = events.findIndex(e => e.title.toLowerCase().includes(term));
        if (matchIdx !== -1) {
          const matchedEvent = events[matchIdx];
          
          if (!isDemoMode) {
            supabase.from("events").delete().eq("id", matchedEvent.id).then(({ error }) => {
              if (error) {
                console.error("Error cancelling event in Supabase:", error);
                addToast("❌ Failed to cancel event in database.");
              } else {
                setEvents((prev) => prev.filter((_, idx) => idx !== matchIdx));
                setActivity((prev) => [
                  {
                    id: Math.random().toString(),
                    text: `Event "${matchedEvent.title}" deleted by AI Copilot Command`,
                    time: "Just now",
                    type: "event_delete"
                  },
                  ...prev
                ]);
                addToast(`🗑️ Cancelled event: "${matchedEvent.title}"`);
              }
            });
          } else {
            setEvents((prev) => prev.filter((_, idx) => idx !== matchIdx));
            setActivity((prev) => [
              {
                id: Math.random().toString(),
                text: `Event "${matchedEvent.title}" deleted by AI Copilot Command`,
                time: "Just now",
                type: "event_delete"
              },
              ...prev
            ]);
            addToast(`🗑️ Cancelled event: "${matchedEvent.title}"`);
          }
        } else {
          addToast("❌ Cancellation target not found.");
        }
      }
      else if (action === "POST_ANNOUNCEMENT" && params.announcementText) {
        const text = params.announcementText;
        const dateObj = new Date();
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const formattedDate = `${months[dateObj.getMonth()]} ${String(dateObj.getDate()).padStart(2, "0")}, ${dateObj.getFullYear()}`;
        const timeStringNow = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const title = text.length > 30 ? text.substring(0, 30) + "..." : text;

        if (!isDemoMode && userProfile) {
          supabase.from("announcements").insert({
            title: "AI Broadcast: " + title,
            body: text,
            text: text,
            date: formattedDate,
            time: timeStringNow,
            creator: "AI Copilot System",
            code: "all",
            emoji: "🤖",
            user_id: userProfile.user_id || userProfile.id
          }).select().single().then(({ data, error }) => {
            if (error) {
              console.error("Error creating AI announcement in Supabase:", error);
            } else if (data) {
              setAnnouncements((prev) => [data, ...prev]);
              setAnnouncementsCount((prev) => prev + 1);
              addToast("📣 Announcement saved to database!");
            }
          });
        } else {
          const newAnn = {
            id: Math.random().toString(),
            title: "AI Broadcast: " + title,
            body: text,
            text: text,
            date: formattedDate,
            time: timeStringNow,
            creator: "AI Copilot System",
            code: "all",
            emoji: "🤖"
          };

          setAnnouncements((prev) => [newAnn, ...prev]);
          setAnnouncementsCount((prev) => prev + 1);
        }
        addToast("📣 Announcement published successfully!");
      }

      if (replyText.toLowerCase().includes("rulebook") || replyText.toLowerCase().includes("rules verified")) {
        isRuleCheck = true;
      } else if (replyText.toLowerCase().includes("spam filter") || replyText.toLowerCase().includes("moderation safety")) {
        isModerator = true;
      } else if (replyText.toLowerCase().includes("weekly organizer sync") || replyText.toLowerCase().includes("meeting summary")) {
        isReport = true;
      }

      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: replyText,
          timestamp: timeString,
          isSchedule,
          isReport,
          isRuleCheck,
          isModerator
        }
      ]);
      setIsAiTyping(false);
      addToast("🤖 AI Copilot finished execution!");

    } catch (err: any) {
      console.error(err);
      const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setChatMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "ai",
          text: `⚠️ **AI Copilot connection failure!**\nFailed to reach the chat backend securely.\n*Fallback offline NLP parsing mode activated.*\n\nDetail: ${err?.message || err}`,
          timestamp: timeString
        }
      ]);
      setIsAiTyping(false);
      addToast("⚠️ AI offline fallback triggered.");
    }
  };

  const handleSendMessage = (e?: React.FormEvent, customText?: string, actionType?: string) => {
    if (e) e.preventDefault();
    const promptToSend = customText || chatInput;
    if (!promptToSend.trim()) return;

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setChatMessages((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        sender: "user",
        text: promptToSend,
        timestamp: timeString
      }
    ]);

    setChatInput("");
    simulateAiResponse(promptToSend, actionType || "custom");
  };

  const triggerPresetPrompt = (presetName: string, actionType: string) => {
    handleSendMessage(undefined, presetName, actionType);
  };

  return (
    <DashboardContext.Provider
      value={{
        isMounted,
        sidebarTab,
        setSidebarTab,
        userProfile,
        loadingProfile,
        logout,
        toasts,
        addToast,
        searchQuery,
        setSearchQuery,
        isSearchFocused,
        setIsSearchFocused,
        smartSearchInput,
        setSmartSearchInput,
        smartSearchResult,
        setSmartSearchResult,
        isSmartSearching,
        smartSearchQueryTitle,
        handleSmartSearch,
        selectedEventForTeams,
        setSelectedEventForTeams,
        isTeamsModalOpen,
        setIsTeamsModalOpen,
        newTeamName,
        setNewTeamName,
        newTeamNumber,
        setNewTeamNumber,
        eventTeams,
        handleAddTeam,
        handleDeleteTeam,
        meetingInputType,
        setMeetingInputType,
        meetingText,
        setMeetingText,
        uploadedPdfFile,
        setUploadedPdfFile,
        isProcessingMeeting,
        meetingProcessingStep,
        isDragOver,
        setIsDragOver,
        activeResultTab,
        setActiveResultTab,
        meetingResult,
        setMeetingResult,
        processMeetingIntel,
        toggleActionItem,
        totalParticipants,
        setTotalParticipants,
        upcomingEventsCount,
        setUpcomingEventsCount,
        activeTournamentsCount,
        setActiveTournamentsCount,
        announcementsCount,
        donutData,
        setDonutData,
        currentDate,
        events,
        setEvents,
        isCreateModalOpen,
        setIsCreateModalOpen,
        newEventTitle,
        setNewEventTitle,
        newEventGame,
        setNewEventGame,
        newEventDate,
        setNewEventDate,
        newEventTime,
        setNewEventTime,
        newEventTeams,
        setNewEventTeams,
        newEventFormat,
        setNewEventFormat,
        handleCreateEvent,
        handleDeleteEvent,
        chatMessages,
        setChatMessages,
        chatInput,
        setChatInput,
        isAiTyping,
        chatBottomRef,
        handleSendMessage,
        triggerPresetPrompt,
        activity,
        setActivity,
        announcements,
        setAnnouncements,
        getEventStats
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}

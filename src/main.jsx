import React, { useEffect, useMemo, useState } from 'react';
import { createRoot } from 'react-dom/client';
import {
  Search, House, LibraryBig, FileText, MessageSquare, Megaphone,
  Bookmark, Upload, Sun, Moon, Menu, ArrowUpRight, Download,
  File, ChevronDown, SlidersHorizontal, Plus, ArrowRight, Command,
  BookOpen, GraduationCap, CircleHelp, Sparkles, X
} from 'lucide-react';
import './styles.css';
import { supabase } from "./supabase";

const categories = ['All resources', 'Notes', 'Previous papers', 'Assignments', 'Lab manuals', 'Syllabus'];

const normalizeResourceType = (value = '') => value.toLowerCase().replace(/\\s+/g, ' ').trim();
const formatResourceDate = (value) => {
  if (!value) return 'Recently added';
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 'Recently added' :
    date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
};

function App() {
  const [departments, setDepartments] = useState(['All departments']);
  const [departmentRows, setDepartmentRows] = useState([]);
  const [departmentError, setDepartmentError] = useState('');
  const [selectedSemester, setSelectedSemester] = useState('1');
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState('');
  const [subjectLoading, setSubjectLoading] = useState(false);
  const [subjectError, setSubjectError] = useState('');
  const [subjectResources, setSubjectResources] = useState([]);
  const [resourceLoading, setResourceLoading] = useState(false);
  const [resourceError, setResourceError] = useState('');
  const [homepageResources, setHomepageResources] = useState([]);
  const [homepageLoading, setHomepageLoading] = useState(true);
  const [homepageError, setHomepageError] = useState('');

  useEffect(() => {
    let isMounted = true;

    async function loadDepartments() {
      const { data, error } = await supabase
        .from('departments')
        .select('id, name, code')
        .order('name');

      if (!isMounted) return;

      if (error) {
        console.error('Could not load departments:', error.message);
        setDepartmentError('Departments could not be loaded. Please refresh.');
        return;
      }

      setDepartmentRows(data || []);
      setDepartments(['All departments', ...(data || []).map(item => item.code)]);
      setDepartmentError('');
    }

    loadDepartments();
    return () => { isMounted = false; };
  }, []);
  const [theme, setTheme] = useState('light');
  const [active, setActive] = useState('Overview');
  const [query, setQuery] = useState('');
  const [department, setDepartment] = useState('All departments');
  const [category, setCategory] = useState('All resources');
  const [view, setView] = useState('grid');
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [resourceSort, setResourceSort] = useState('recent');

  // Admin-only area and authentication state
  const [adminMode, setAdminMode] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminUser, setAdminUser] = useState(null);
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [adminDepartments, setAdminDepartments] = useState([]);
  const [adminSubjects, setAdminSubjects] = useState([]);
  const [departmentForm, setDepartmentForm] = useState({ name: '', code: '' });
  const [departmentManageSearch, setDepartmentManageSearch] = useState('');
  const [editingDepartmentId, setEditingDepartmentId] = useState(null);
  const [editDepartmentForm, setEditDepartmentForm] = useState({ name: '', code: '' });
  const [departmentManageBusy, setDepartmentManageBusy] = useState(false);
  const [departmentManageMessage, setDepartmentManageMessage] = useState('');
  const [departmentManageError, setDepartmentManageError] = useState('');
  const [adminAnnouncements, setAdminAnnouncements] = useState([]);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', body: '' });
  const [editingAnnouncementId, setEditingAnnouncementId] = useState(null);
  const [editAnnouncementForm, setEditAnnouncementForm] = useState({ title: '', body: '' });
  const [announcementManageBusy, setAnnouncementManageBusy] = useState(false);
  const [announcementManageMessage, setAnnouncementManageMessage] = useState('');
  const [announcementManageError, setAnnouncementManageError] = useState('');
  const [studentAnnouncements, setStudentAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(false);
  const [requestForm, setRequestForm] = useState({
    studentName: '', departmentId: '', semester: '1', subjectId: '',
    resourceType: 'Notes', description: ''
  });
  const [requestSubjects, setRequestSubjects] = useState([]);
  const [requestSubjectsLoading, setRequestSubjectsLoading] = useState(false);
  const [requestSubmitting, setRequestSubmitting] = useState(false);
  const [requestMessage, setRequestMessage] = useState('');
  const [requestError, setRequestError] = useState('');
  const [adminRequests, setAdminRequests] = useState([]);
  const [requestManageLoading, setRequestManageLoading] = useState(false);
  const [requestManageBusy, setRequestManageBusy] = useState(false);
  const [requestManageMessage, setRequestManageMessage] = useState('');
  const [requestManageError, setRequestManageError] = useState('');
  const [requestSearch, setRequestSearch] = useState('');
  const [uploadItems, setUploadItems] = useState([]);
  const [uploadBusy, setUploadBusy] = useState(false);
  const [uploadMessage, setUploadMessage] = useState('');
  const [adminResources, setAdminResources] = useState([]);
  const [resourceManageLoading, setResourceManageLoading] = useState(false);
  const [resourceManageError, setResourceManageError] = useState('');
  const [resourceManageMessage, setResourceManageMessage] = useState('');
  const [resourceSearch, setResourceSearch] = useState('');
  const [editingResourceId, setEditingResourceId] = useState(null);
  const [editResource, setEditResource] = useState({});
  const [resourceActionBusy, setResourceActionBusy] = useState(false);
  const [subjectForm, setSubjectForm] = useState({
    departmentId: '', semester: '1', name: '', code: ''
  });
  const [subjectManageSearch, setSubjectManageSearch] = useState('');
  const [editingSubjectId, setEditingSubjectId] = useState(null);
  const [editSubjectForm, setEditSubjectForm] = useState({
    departmentId: '', semester: '1', name: '', code: ''
  });
  const [subjectManageBusy, setSubjectManageBusy] = useState(false);
  const [subjectManageMessage, setSubjectManageMessage] = useState('');
  const [subjectManageError, setSubjectManageError] = useState('');

  // Community forum state
  const [communityUser, setCommunityUser] = useState(null);
  const [communityPosts, setCommunityPosts] = useState([]);
  const [communityLoading, setCommunityLoading] = useState(false);
  const [communityError, setCommunityError] = useState('');
  const [communityMessage, setCommunityMessage] = useState('');
  const [communityForm, setCommunityForm] = useState({ nickname: '', departmentId: '', semester: '1', subjectId: '', title: '', body: '' });
  const [communitySubjects, setCommunitySubjects] = useState([]);
  const [communitySubmitting, setCommunitySubmitting] = useState(false);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const [communityReplies, setCommunityReplies] = useState({});
  const [replyDrafts, setReplyDrafts] = useState({});
  const [editingPostId, setEditingPostId] = useState(null);
  const [editPostForm, setEditPostForm] = useState({ title: '', body: '' });
  const [communityBusy, setCommunityBusy] = useState(false);
  const [communityFilter, setCommunityFilter] = useState('all');
  const [adminCommunityReports, setAdminCommunityReports] = useState([]);
  const [adminCommunityPosts, setAdminCommunityPosts] = useState([]);
  const [communityAdminMessage, setCommunityAdminMessage] = useState('');
  const [communityAdminError, setCommunityAdminError] = useState('');
  const [communityAdminBusy, setCommunityAdminBusy] = useState(false);




  // Establish a lightweight anonymous identity for students (no registration form).
  useEffect(() => {
    let active = true;
    const ensureCommunitySession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      let user = sessionData?.session?.user || null;
      if (!user) {
        const { data, error } = await supabase.auth.signInAnonymously();
        if (error) {
          if (active) setCommunityError(`Community sign-in unavailable: ${error.message}`);
          return;
        }
        user = data?.user || null;
      }
      if (active) setCommunityUser(user);
    };
    ensureCommunitySession();
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (active && session?.user) setCommunityUser(session.user);
    });
    return () => { active = false; authListener?.subscription?.unsubscribe(); };
  }, []);

  useEffect(() => {
    let active = true;
    const loadCommunitySubjects = async () => {
      if (!communityForm.departmentId) { setCommunitySubjects([]); return; }
      const { data, error } = await supabase.from('subjects')
        .select('id, name, semester')
        .eq('department_id', communityForm.departmentId)
        .eq('semester', Number(communityForm.semester))
        .order('name');
      if (!active) return;
      if (error) setCommunityError(`Could not load forum subjects: ${error.message}`);
      else setCommunitySubjects(data || []);
    };
    loadCommunitySubjects();
    return () => { active = false; };
  }, [communityForm.departmentId, communityForm.semester]);

  const loadCommunityPosts = async () => {
    setCommunityLoading(true);
    setCommunityError('');
    let request = supabase.from('community_posts')
      .select('id, nickname, department_id, semester, subject_id, title, body, author_id, is_hidden, created_at')
      .eq('is_hidden', false)
      .order('created_at', { ascending: false });
    if (communityFilter === 'general') request = request.is('subject_id', null);
    if (communityFilter === 'subject') request = request.not('subject_id', 'is', null);
    const { data, error } = await request;
    setCommunityLoading(false);
    if (error) { setCommunityError(`Could not load discussions: ${error.message}`); return; }
    setCommunityPosts(data || []);
  };

  useEffect(() => {
    if (active === 'Community' && communityUser) loadCommunityPosts();
  }, [active, communityUser, communityFilter]);

  const submitCommunityPost = async (event) => {
    event.preventDefault();
    const { nickname, title, body } = communityForm;
    if (!communityUser) { setCommunityError('Preparing your community session. Please try again.'); return; }
    if (!nickname.trim() || !title.trim() || !body.trim()) {
      setCommunityError('Nickname, title and message are required.'); return;
    }
    setCommunitySubmitting(true); setCommunityError(''); setCommunityMessage('');
    const { error } = await supabase.from('community_posts').insert({
      author_id: communityUser.id,
      nickname: nickname.trim(),
      department_id: communityForm.departmentId || null,
      semester: communityForm.departmentId ? Number(communityForm.semester) : null,
      subject_id: communityForm.subjectId || null,
      title: title.trim(), body: body.trim()
    });
    setCommunitySubmitting(false);
    if (error) { setCommunityError(`Post could not be published: ${error.message}`); return; }
    setCommunityForm(v => ({ ...v, title: '', body: '' }));
    setCommunityMessage('Your discussion has been posted.');
    await loadCommunityPosts();
  };

  const loadCommunityReplies = async (postId) => {
    const { data, error } = await supabase.from('community_replies')
      .select('id, post_id, nickname, body, author_id, created_at')
      .eq('post_id', postId).eq('is_hidden', false).order('created_at');
    if (error) { setCommunityError(`Could not load replies: ${error.message}`); return; }
    setCommunityReplies(v => ({ ...v, [postId]: data || [] }));
  };

  const togglePostReplies = async (postId) => {
    if (expandedPostId === postId) { setExpandedPostId(null); return; }
    setExpandedPostId(postId);
    await loadCommunityReplies(postId);
  };

  const submitCommunityReply = async (post) => {
    const body = (replyDrafts[post.id] || '').trim();
    if (!body || !communityUser) return;
    setCommunityBusy(true); setCommunityError('');
    const { error } = await supabase.from('community_replies').insert({
      post_id: post.id, author_id: communityUser.id,
      nickname: communityForm.nickname.trim() || 'GBPIET Student', body
    });
    setCommunityBusy(false);
    if (error) { setCommunityError(`Reply could not be posted: ${error.message}`); return; }
    setReplyDrafts(v => ({ ...v, [post.id]: '' }));
    await loadCommunityReplies(post.id);
  };

  const saveCommunityPostEdit = async (post) => {
    if (!editPostForm.title.trim() || !editPostForm.body.trim()) return;
    setCommunityBusy(true);
    const { error } = await supabase.from('community_posts')
      .update({ title: editPostForm.title.trim(), body: editPostForm.body.trim(), updated_at: new Date().toISOString() })
      .eq('id', post.id).eq('author_id', communityUser.id);
    setCommunityBusy(false);
    if (error) { setCommunityError(`Could not update post: ${error.message}`); return; }
    setEditingPostId(null); await loadCommunityPosts();
  };

  const deleteCommunityPost = async (post) => {
    if (!window.confirm('Delete this discussion and all its replies?')) return;
    setCommunityBusy(true);
    const { error } = await supabase.from('community_posts').delete().eq('id', post.id).eq('author_id', communityUser.id);
    setCommunityBusy(false);
    if (error) { setCommunityError(`Could not delete post: ${error.message}`); return; }
    setCommunityPosts(v => v.filter(item => item.id !== post.id));
  };

  const reportCommunityPost = async (post) => {
    const reason = window.prompt('Why are you reporting this discussion? (Spam, harassment, inappropriate content, or other)');
    if (!reason?.trim()) return;
    const { error } = await supabase.from('community_reports').insert({ post_id: post.id, reason: reason.trim() });
    if (error) setCommunityError(`Report could not be submitted: ${error.message}`);
    else setCommunityMessage('Report submitted for admin review.');
  };

  const reportCommunityReply = async (reply) => {
    const reason = window.prompt('Why are you reporting this reply?');
    if (!reason?.trim()) return;
    const { error } = await supabase.from('community_reports').insert({ reply_id: reply.id, reason: reason.trim() });
    if (error) setCommunityError(`Report could not be submitted: ${error.message}`);
    else setCommunityMessage('Report submitted for admin review.');
  };

  const loadAdminCommunityReports = async () => {
    setCommunityAdminError('');
    const { data: reports, error } = await supabase.from('community_reports')
      .select('id, post_id, reply_id, reason, details, status, created_at')
      .order('created_at', { ascending: false });
    if (error) { setCommunityAdminError(`Could not load reports: ${error.message}`); return; }
    const postIds = [...new Set((reports || []).map(r => r.post_id).filter(Boolean))];
    const replyIds = [...new Set((reports || []).map(r => r.reply_id).filter(Boolean))];
    const [{ data: posts }, { data: replies }] = await Promise.all([
      postIds.length ? supabase.from('community_posts').select('id, title, body, nickname, is_hidden').in('id', postIds) : Promise.resolve({ data: [] }),
      replyIds.length ? supabase.from('community_replies').select('id, body, nickname, is_hidden').in('id', replyIds) : Promise.resolve({ data: [] })
    ]);
    const postMap = Object.fromEntries((posts || []).map(x => [x.id, x]));
    const replyMap = Object.fromEntries((replies || []).map(x => [x.id, x]));
    setAdminCommunityReports((reports || []).map(report => ({
      ...report,
      target: report.post_id ? postMap[report.post_id] : replyMap[report.reply_id],
      targetType: report.post_id ? 'post' : 'reply'
    })));
  };

  const updateCommunityReportStatus = async (report, status) => {
    setCommunityAdminBusy(true);
    setCommunityAdminError('');
    const { error } = await supabase.from('community_reports').update({ status }).eq('id', report.id);
    setCommunityAdminBusy(false);
    if (error) { setCommunityAdminError(`Could not update report: ${error.message}`); return; }
    setAdminCommunityReports(current => current.map(r => r.id === report.id ? { ...r, status } : r));
    setCommunityAdminMessage(`Report marked ${status}.`);
  };

  const moderateCommunityTarget = async (report, action) => {
    const isPost = report.targetType === 'post';
    const table = isPost ? 'community_posts' : 'community_replies';
    const targetId = isPost ? report.post_id : report.reply_id;
    setCommunityAdminBusy(true);
    setCommunityAdminError('');
    const { error } = await supabase.from(table)
      .update({ is_hidden: action === 'hide' })
      .eq('id', targetId);
    setCommunityAdminBusy(false);
    if (error) { setCommunityAdminError(`Could not ${action} content: ${error.message}`); return; }
    setCommunityAdminMessage(action === 'hide' ? 'Content hidden from students.' : 'Content restored for students.');
    await loadAdminCommunityReports();
  };

  const deleteCommunityReport = async (report) => {
    if (!window.confirm('Delete this report record? The reported content will not be deleted.')) return;
    setCommunityAdminBusy(true);
    const { error } = await supabase.from('community_reports').delete().eq('id', report.id);
    setCommunityAdminBusy(false);
    if (error) { setCommunityAdminError(`Could not delete report: ${error.message}`); return; }
    setAdminCommunityReports(current => current.filter(r => r.id !== report.id));
    setCommunityAdminMessage('Report record deleted.');
  };

  const verifyAdmin = async (user) => {
    if (!user) return false;
    const { data, error } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', user.id)
      .maybeSingle();

    if (error) {
      console.error('Admin verification failed:', error.message);
      setAdminError('Could not verify admin access. Please check the admin_users table policy.');
      return false;
    }

    if (!data) {
      setAdminError('This account does not have Stack administrator access.');
      await supabase.auth.signOut();
      return false;
    }

    setAdminUser(user);
    setAdminError('');
    setAdminMode(true);
    return true;
  };

  const handleAdminLogin = async (event) => {
    event.preventDefault();
    setAdminLoading(true);
    setAdminError('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminEmail.trim(),
      password: adminPassword
    });

    if (error) {
      setAdminError(error.message);
      setAdminLoading(false);
      return;
    }

    await verifyAdmin(data.user);
    setAdminLoading(false);
  };

  const handleAdminLogout = async () => {
    await supabase.auth.signOut();
    setAdminUser(null);
    setAdminPassword('');
    setAdminMode(false);
    setAdminError('');
  };

  useEffect(() => {
    if (!adminMode) return;
    let active = true;

    async function loadAdminChoices() {
      const [{ data: deptData, error: deptError }, { data: subjectData, error: subjectError }] = await Promise.all([
        supabase.from('departments').select('id, name, code').order('name'),
        supabase.from('subjects').select('id, name, code, semester, department_id').order('name')
      ]);

      if (!active) return;
      if (deptError || subjectError) {
        setUploadMessage('Could not load departments or subjects. Please refresh.');
        return;
      }
      setAdminDepartments(deptData || []);
      setAdminSubjects(subjectData || []);
      const { data: announcementData, error: announcementError } = await supabase
        .from('announcements')
        .select('id, title, body, is_published, created_at, updated_at')
        .order('created_at', { ascending: false });
      if (announcementError) {
        setAnnouncementManageError(`Could not load announcements: ${announcementError.message}`);
      } else {
        setAdminAnnouncements(announcementData || []);
      }
    }

    loadAdminChoices();
    return () => { active = false; };
  }, [adminMode]);

  useEffect(() => {
    let active = true;

    async function loadStudentAnnouncements() {
      setAnnouncementLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('id, title, body, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!active) return;
      setAnnouncementLoading(false);
      if (error) {
        console.error('Could not load announcements:', error.message);
        return;
      }
      setStudentAnnouncements(data || []);
    }

    loadStudentAnnouncements();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    let active = true;

    async function loadRequestSubjects() {
      setRequestSubjects([]);
      if (!requestForm.departmentId) return;
      setRequestSubjectsLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, code, semester')
        .eq('department_id', requestForm.departmentId)
        .eq('semester', Number(requestForm.semester))
        .order('name');
      if (!active) return;
      setRequestSubjectsLoading(false);
      if (error) {
        setRequestError('Could not load subjects for this request. Please try again.');
        return;
      }
      setRequestSubjects(data || []);
    }

    loadRequestSubjects();
    return () => { active = false; };
  }, [requestForm.departmentId, requestForm.semester]);

  const addUploadFiles = (fileList) => {
    const pdfs = Array.from(fileList || []).filter(file => file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf'));
    if (!pdfs.length) {
      setUploadMessage('Please choose PDF files only.');
      return;
    }

    const defaults = adminDepartments[0];
    setUploadItems(current => [
      ...current,
      ...pdfs.map(file => ({
        key: `${file.name}-${file.size}-${crypto.randomUUID()}`,
        file,
        title: file.name.replace(/\\.pdf$/i, '').replace(/[_-]+/g, ' '),
        description: '',
        departmentId: defaults?.id || '',
        semester: '4',
        subjectId: '',
        resourceType: 'Notes',
        academicYear: '2025-26'
      }))
    ]);
    setUploadMessage('');
  };

  const updateUploadItem = (key, field, value) => {
    setUploadItems(items => items.map(item => {
      if (item.key !== key) return item;
      const updated = { ...item, [field]: value };
      if (field === 'departmentId' || field === 'semester') updated.subjectId = '';
      return updated;
    }));
  };

  const uploadSelectedResources = async () => {
    if (!uploadItems.length) {
      setUploadMessage('Choose at least one PDF first.');
      return;
    }

    for (const item of uploadItems) {
      if (!item.title.trim() || !item.departmentId || !item.subjectId) {
        setUploadMessage('Each PDF needs a title, department and subject.');
        return;
      }
    }

    setUploadBusy(true);
    setUploadMessage('');
    let completed = 0;

    for (const item of uploadItems) {
      const dept = adminDepartments.find(row => String(row.id) === String(item.departmentId));
      const safeName = item.file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
      const filePath = `${dept?.code || 'resources'}/sem-${item.semester}/${crypto.randomUUID()}-${safeName}`;

      const { error: storageError } = await supabase.storage
        .from('academic-resources')
        .upload(filePath, item.file, { contentType: 'application/pdf', upsert: false });

      if (storageError) {
        setUploadMessage(`Upload failed for ${item.file.name}: ${storageError.message}`);
        setUploadBusy(false);
        return;
      }

      const { error: recordError } = await supabase.from('resources').insert({
        subject_id: item.subjectId,
        title: item.title.trim(),
        description: item.description.trim() || null,
        resource_type: item.resourceType,
        academic_year: item.academicYear,
        file_path: filePath,
        is_published: true
      });

      if (recordError) {
        setUploadMessage(`The PDF uploaded, but its resource record failed for ${item.file.name}: ${recordError.message}`);
        setUploadBusy(false);
        return;
      }
      completed += 1;
    }

    setUploadItems([]);
    setUploadBusy(false);
    setUploadMessage(`Successfully uploaded and published ${completed} PDF${completed === 1 ? '' : 's'}.`);
  };


  const loadAdminResources = async () => {
    setResourceManageLoading(true);
    setResourceManageError('');
    const { data, error } = await supabase
      .from('resources')
      .select('id, subject_id, title, description, resource_type, academic_year, file_path, is_published, is_featured, download_count, created_at')
      .order('created_at', { ascending: false });

    setResourceManageLoading(false);
    if (error) {
      console.error('Could not load admin resources:', error.message);
      setResourceManageError(`Could not load resources: ${error.message}`);
      return;
    }
    setAdminResources(data || []);
  };

  useEffect(() => {
    if (adminMode) loadAdminResources();
  }, [adminMode]);

  useEffect(() => {
    if (adminMode) loadAdminRequests();
  }, [adminMode]);
  useEffect(() => {
    if (adminMode) loadAdminCommunityReports();
  }, [adminMode]);

  const beginResourceEdit = (item) => {
    setEditingResourceId(item.id);
    setEditResource({
      title: item.title || '',
      description: item.description || '',
      resource_type: item.resource_type || 'Notes',
      academic_year: item.academic_year || '',
      subject_id: String(item.subject_id || '')
    });
    setResourceManageMessage('');
  };

  const saveResourceEdit = async (item) => {
    if (!editResource.title.trim() || !editResource.subject_id) {
      setResourceManageMessage('Title and subject are required.');
      return;
    }
    setResourceActionBusy(true);
    setResourceManageMessage('');
    const { error } = await supabase
      .from('resources')
      .update({
        title: editResource.title.trim(),
        description: editResource.description.trim() || null,
        resource_type: editResource.resource_type,
        academic_year: editResource.academic_year.trim() || null,
        subject_id: editResource.subject_id
      })
      .eq('id', item.id);

    setResourceActionBusy(false);
    if (error) {
      setResourceManageMessage(`Could not save changes: ${error.message}`);
      return;
    }
    setEditingResourceId(null);
    setResourceManageMessage('Resource details updated.');
    await loadAdminResources();
  };

  const toggleResourcePublished = async (item) => {
    setResourceActionBusy(true);
    setResourceManageMessage('');
    const { error } = await supabase
      .from('resources')
      .update({ is_published: !item.is_published })
      .eq('id', item.id);

    setResourceActionBusy(false);
    if (error) {
      setResourceManageMessage(`Could not change publication status: ${error.message}`);
      return;
    }
    setResourceManageMessage(item.is_published ? 'Resource unpublished.' : 'Resource published.');
    await loadAdminResources();
  };

  const toggleResourceFeatured = async (item) => {
    setResourceActionBusy(true);
    setResourceManageMessage('');
    const { error } = await supabase
      .from('resources')
      .update({ is_featured: !item.is_featured })
      .eq('id', item.id);
    setResourceActionBusy(false);
    if (error) {
      setResourceManageMessage(`Could not update featured status: ${error.message}`);
      return;
    }
    setResourceManageMessage(item.is_featured ? 'Resource removed from featured.' : 'Resource featured in the collection.');
    await loadAdminResources();
  };

  const deleteAdminResource = async (item) => {
    const confirmed = window.confirm(
      `Delete "${item.title}" and its stored PDF permanently? This cannot be undone.`
    );
    if (!confirmed) return;

    setResourceActionBusy(true);
    setResourceManageMessage('');
    const { error: recordError } = await supabase
      .from('resources')
      .delete()
      .eq('id', item.id);

    if (recordError) {
      setResourceActionBusy(false);
      setResourceManageMessage(`Could not delete resource record: ${recordError.message}`);
      return;
    }

    const { error: fileError } = await supabase.storage
      .from('academic-resources')
      .remove([item.file_path]);

    setResourceActionBusy(false);
    if (fileError) {
      setResourceManageMessage(`Resource record deleted, but the PDF file could not be removed: ${fileError.message}`);
    } else {
      setResourceManageMessage('Resource and PDF deleted.');
    }
    await loadAdminResources();
  };


  const submitResourceRequest = async (event) => {
    event.preventDefault();
    const name = requestForm.studentName.trim();
    const description = requestForm.description.trim();
    if (!name || !requestForm.departmentId || !requestForm.subjectId || !description) {
      setRequestError('Please complete your name, department, semester, subject and request details.');
      setRequestMessage('');
      return;
    }

    setRequestSubmitting(true);
    setRequestError('');
    setRequestMessage('');
    const { error } = await supabase
      .from('resource_requests')
      .insert({
        student_name: name,
        department_id: requestForm.departmentId,
        semester: Number(requestForm.semester),
        subject_id: requestForm.subjectId,
        resource_type: requestForm.resourceType,
        description
      });
    setRequestSubmitting(false);

    if (error) {
      setRequestError(`Your request could not be submitted: ${error.message}`);
      return;
    }

    setRequestForm(current => ({ ...current, studentName: '', subjectId: '', description: '' }));
    setRequestMessage('Your resource request has been submitted. Thank you!');
  };

  const loadAdminRequests = async () => {
    setRequestManageLoading(true);
    setRequestManageError('');
    const { data, error } = await supabase
      .from('resource_requests')
      .select('id, student_name, department_id, semester, subject_id, resource_type, description, status, created_at')
      .order('created_at', { ascending: false });
    setRequestManageLoading(false);
    if (error) {
      setRequestManageError(`Could not load requests: ${error.message}`);
      return;
    }
    setAdminRequests(data || []);
  };

  const updateResourceRequestStatus = async (item, status) => {
    setRequestManageBusy(true);
    setRequestManageError('');
    setRequestManageMessage('');
    const { error } = await supabase
      .from('resource_requests')
      .update({ status })
      .eq('id', item.id);
    setRequestManageBusy(false);
    if (error) {
      setRequestManageError(`Could not update request: ${error.message}`);
      return;
    }
    setAdminRequests(current => current.map(row => row.id === item.id ? { ...row, status } : row));
    setRequestManageMessage(`Request marked ${status}.`);
  };

  const deleteResourceRequest = async (item) => {
    if (!window.confirm('Delete this resource request permanently?')) return;
    setRequestManageBusy(true);
    setRequestManageError('');
    setRequestManageMessage('');
    const { error } = await supabase
      .from('resource_requests')
      .delete()
      .eq('id', item.id);
    setRequestManageBusy(false);
    if (error) {
      setRequestManageError(`Could not delete request: ${error.message}`);
      return;
    }
    setAdminRequests(current => current.filter(row => row.id !== item.id));
    setRequestManageMessage('Request deleted.');
  };

  const filteredAdminRequests = adminRequests.filter(item => {
    const dept = adminDepartments.find(row => String(row.id) === String(item.department_id));
    const subject = adminSubjects.find(row => String(row.id) === String(item.subject_id));
    const text = `${item.student_name} ${dept?.name || ''} ${dept?.code || ''} ${subject?.name || ''} ${item.resource_type} ${item.description} ${item.status}`.toLowerCase();
    return text.includes(requestSearch.toLowerCase());
  });

  const addAdminAnnouncement = async (event) => {
    event.preventDefault();
    const title = announcementForm.title.trim();
    const body = announcementForm.body.trim();
    if (!title || !body) {
      setAnnouncementManageError('Enter both an announcement title and message.');
      return;
    }

    setAnnouncementManageBusy(true);
    setAnnouncementManageError('');
    setAnnouncementManageMessage('');
    const { data, error } = await supabase
      .from('announcements')
      .insert({ title, body, is_published: false })
      .select('id, title, body, is_published, created_at, updated_at')
      .single();
    setAnnouncementManageBusy(false);

    if (error) {
      setAnnouncementManageError(`Could not save announcement: ${error.message}`);
      return;
    }
    setAdminAnnouncements(current => [data, ...current]);
    setAnnouncementForm({ title: '', body: '' });
    setAnnouncementManageMessage('Announcement saved as draft.');
  };

  const startAnnouncementEdit = (item) => {
    setEditingAnnouncementId(item.id);
    setEditAnnouncementForm({ title: item.title || '', body: item.body || '' });
    setAnnouncementManageError('');
    setAnnouncementManageMessage('');
  };

  const saveAdminAnnouncement = async (item) => {
    const title = editAnnouncementForm.title.trim();
    const body = editAnnouncementForm.body.trim();
    if (!title || !body) {
      setAnnouncementManageError('Title and message are required.');
      return;
    }

    setAnnouncementManageBusy(true);
    setAnnouncementManageError('');
    setAnnouncementManageMessage('');
    const { data, error } = await supabase
      .from('announcements')
      .update({ title, body, updated_at: new Date().toISOString() })
      .eq('id', item.id)
      .select('id, title, body, is_published, created_at, updated_at')
      .single();
    setAnnouncementManageBusy(false);

    if (error) {
      setAnnouncementManageError(`Could not update announcement: ${error.message}`);
      return;
    }
    setAdminAnnouncements(current => current.map(row => row.id === item.id ? data : row));
    setEditingAnnouncementId(null);
    setAnnouncementManageMessage('Announcement updated.');
    await refreshStudentAnnouncements();
  };

  const refreshStudentAnnouncements = async () => {
    const { data, error } = await supabase
      .from('announcements')
      .select('id, title, body, created_at')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (!error) setStudentAnnouncements(data || []);
  };

  const toggleAnnouncementPublished = async (item) => {
    setAnnouncementManageBusy(true);
    setAnnouncementManageError('');
    setAnnouncementManageMessage('');
    const { data, error } = await supabase
      .from('announcements')
      .update({ is_published: !item.is_published, updated_at: new Date().toISOString() })
      .eq('id', item.id)
      .select('id, title, body, is_published, created_at, updated_at')
      .single();
    setAnnouncementManageBusy(false);

    if (error) {
      setAnnouncementManageError(`Could not change publication status: ${error.message}`);
      return;
    }
    setAdminAnnouncements(current => current.map(row => row.id === item.id ? data : row));
    setAnnouncementManageMessage(item.is_published ? 'Announcement unpublished.' : 'Announcement published.');
    await refreshStudentAnnouncements();
  };

  const deleteAdminAnnouncement = async (item) => {
    if (!window.confirm(`Delete announcement "${item.title}"? This cannot be undone.`)) return;

    setAnnouncementManageBusy(true);
    setAnnouncementManageError('');
    setAnnouncementManageMessage('');
    const { error } = await supabase
      .from('announcements')
      .delete()
      .eq('id', item.id);
    setAnnouncementManageBusy(false);

    if (error) {
      setAnnouncementManageError(`Could not delete announcement: ${error.message}`);
      return;
    }
    setAdminAnnouncements(current => current.filter(row => row.id !== item.id));
    setAnnouncementManageMessage('Announcement deleted.');
    await refreshStudentAnnouncements();
  };

  const addAdminDepartment = async (event) => {
    event.preventDefault();
    const name = departmentForm.name.trim();
    const code = departmentForm.code.trim().toUpperCase();

    if (!name || !code) {
      setDepartmentManageError('Enter both a department name and a short code.');
      return;
    }

    setDepartmentManageBusy(true);
    setDepartmentManageError('');
    setDepartmentManageMessage('');

    const { data, error } = await supabase
      .from('departments')
      .insert({ name, code })
      .select('id, name, code')
      .single();

    setDepartmentManageBusy(false);
    if (error) {
      setDepartmentManageError(
        error.code === '23505'
          ? 'A department with this name or code already exists.'
          : `Could not add department: ${error.message}`
      );
      return;
    }

    setAdminDepartments(current => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
    setDepartmentRows(current => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
    setDepartments(current => [...current.filter(item => item !== 'All departments'), data.code].sort((a, b) => a.localeCompare(b)));
    setDepartmentForm({ name: '', code: '' });
    setDepartmentManageMessage('Department added successfully.');
  };

  const startDepartmentEdit = (dept) => {
    setEditingDepartmentId(dept.id);
    setEditDepartmentForm({ name: dept.name || '', code: dept.code || '' });
    setDepartmentManageError('');
    setDepartmentManageMessage('');
  };

  const saveAdminDepartment = async (dept) => {
    const name = editDepartmentForm.name.trim();
    const code = editDepartmentForm.code.trim().toUpperCase();

    if (!name || !code) {
      setDepartmentManageError('Enter both a department name and a short code.');
      return;
    }

    setDepartmentManageBusy(true);
    setDepartmentManageError('');
    setDepartmentManageMessage('');

    const { data, error } = await supabase
      .from('departments')
      .update({ name, code })
      .eq('id', dept.id)
      .select('id, name, code')
      .single();

    setDepartmentManageBusy(false);
    if (error) {
      setDepartmentManageError(
        error.code === '23505'
          ? 'Another department already uses this name or code.'
          : `Could not update department: ${error.message}`
      );
      return;
    }

    setAdminDepartments(current => current.map(row => row.id === dept.id ? data : row).sort((a, b) => a.name.localeCompare(b.name)));
    setDepartmentRows(current => current.map(row => row.id === dept.id ? data : row).sort((a, b) => a.name.localeCompare(b.name)));
    setDepartments(current => {
      const next = current.filter(item => item !== 'All departments' && item !== dept.code);
      return ['All departments', ...next, data.code].sort((a, b) => a === 'All departments' ? -1 : b === 'All departments' ? 1 : a.localeCompare(b));
    });
    if (department === dept.code) setDepartment(data.code);
    setEditingDepartmentId(null);
    setDepartmentManageMessage('Department updated successfully.');
  };

  const deleteAdminDepartment = async (dept) => {
    const linkedSubjects = adminSubjects.filter(subject => String(subject.department_id) === String(dept.id)).length;

    if (linkedSubjects > 0) {
      setDepartmentManageError(
        `Cannot delete "${dept.name}" because ${linkedSubjects} subject(s) are linked to it. Move or delete those subjects first.`
      );
      setDepartmentManageMessage('');
      return;
    }

    if (!window.confirm(`Delete department "${dept.name}"? This cannot be undone.`)) return;

    setDepartmentManageBusy(true);
    setDepartmentManageError('');
    setDepartmentManageMessage('');

    const { error } = await supabase
      .from('departments')
      .delete()
      .eq('id', dept.id);

    setDepartmentManageBusy(false);
    if (error) {
      setDepartmentManageError(`Could not delete department: ${error.message}`);
      return;
    }

    setAdminDepartments(current => current.filter(row => row.id !== dept.id));
    setDepartmentRows(current => current.filter(row => row.id !== dept.id));
    setDepartments(current => current.filter(item => item !== dept.code));
    if (department === dept.code) setDepartment('All departments');
    setDepartmentManageMessage('Department deleted.');
  };

  const filteredAdminDepartments = adminDepartments.filter(dept => {
    const text = `${dept.name} ${dept.code}`.toLowerCase();
    return text.includes(departmentManageSearch.toLowerCase());
  });

  const addAdminSubject = async (event) => {
    event.preventDefault();
    if (!subjectForm.departmentId || !subjectForm.name.trim()) {
      setSubjectManageError('Choose a department and enter a subject name.');
      return;
    }
    setSubjectManageBusy(true);
    setSubjectManageError('');
    setSubjectManageMessage('');
    const payload = {
      department_id: subjectForm.departmentId,
      semester: Number(subjectForm.semester),
      name: subjectForm.name.trim(),
      code: subjectForm.code.trim() || null
    };
    const { data, error } = await supabase
      .from('subjects')
      .insert(payload)
      .select('id, name, code, semester, department_id')
      .single();
    setSubjectManageBusy(false);
    if (error) {
      setSubjectManageError(error.message.includes('duplicate') || error.code === '23505'
        ? 'A subject with this name or code may already exist in that department and semester.'
        : `Could not add subject: ${error.message}`);
      return;
    }
    setAdminSubjects(current => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
    setSubjectForm(current => ({ ...current, name: '', code: '' }));
    setSubjectManageMessage('Subject added successfully.');
  };

  const startSubjectEdit = (subject) => {
    setEditingSubjectId(subject.id);
    setEditSubjectForm({
      departmentId: String(subject.department_id),
      semester: String(subject.semester),
      name: subject.name || '',
      code: subject.code || ''
    });
    setSubjectManageError('');
    setSubjectManageMessage('');
  };

  const saveAdminSubject = async (subject) => {
    if (!editSubjectForm.departmentId || !editSubjectForm.name.trim()) {
      setSubjectManageError('Choose a department and enter a subject name.');
      return;
    }
    setSubjectManageBusy(true);
    setSubjectManageError('');
    setSubjectManageMessage('');
    const { data, error } = await supabase
      .from('subjects')
      .update({
        department_id: editSubjectForm.departmentId,
        semester: Number(editSubjectForm.semester),
        name: editSubjectForm.name.trim(),
        code: editSubjectForm.code.trim() || null
      })
      .eq('id', subject.id)
      .select('id, name, code, semester, department_id')
      .single();
    setSubjectManageBusy(false);
    if (error) {
      setSubjectManageError(`Could not update subject: ${error.message}`);
      return;
    }
    setAdminSubjects(current => current.map(row => row.id === subject.id ? data : row).sort((a, b) => a.name.localeCompare(b.name)));
    setEditingSubjectId(null);
    setSubjectManageMessage('Subject updated successfully.');
  };

  const deleteAdminSubject = async (subject) => {
    const linkedCount = adminResources.filter(resource => String(resource.subject_id) === String(subject.id)).length;
    if (linkedCount > 0) {
      setSubjectManageError(`Cannot delete "${subject.name}" because ${linkedCount} resource record(s) are linked to it. Move or delete those resources first.`);
      return;
    }
    if (!window.confirm(`Delete subject "${subject.name}"? This cannot be undone.`)) return;

    setSubjectManageBusy(true);
    setSubjectManageError('');
    setSubjectManageMessage('');
    const { error } = await supabase.from('subjects').delete().eq('id', subject.id);
    setSubjectManageBusy(false);
    if (error) {
      setSubjectManageError(`Could not delete subject: ${error.message}`);
      return;
    }
    setAdminSubjects(current => current.filter(row => row.id !== subject.id));
    setSubjectManageMessage('Subject deleted.');
  };

  const filteredAdminSubjects = adminSubjects.filter(subject => {
    const dept = adminDepartments.find(row => String(row.id) === String(subject.department_id));
    const text = `${subject.name} ${subject.code || ''} ${dept?.name || ''} ${dept?.code || ''} semester ${subject.semester}`.toLowerCase();
    return text.includes(subjectManageSearch.toLowerCase());
  });

  const filteredAdminResources = adminResources.filter(item => {
    const subject = adminSubjects.find(row => String(row.id) === String(item.subject_id));
    const dept = adminDepartments.find(row => String(row.id) === String(subject?.department_id));
    const searchText = `${item.title} ${item.description || ''} ${item.resource_type || ''} ${item.academic_year || ''} ${subject?.name || ''} ${dept?.code || ''}`.toLowerCase();
    return searchText.includes(resourceSearch.toLowerCase());
  });

  const selectedDepartmentRow = departmentRows.find(item => item.code === department);

  const selectedSubjectRow = subjects.find(item => String(item.id) === String(selectedSubject));

  useEffect(() => {
    let isMounted = true;
    async function loadHomepageResources() {
      setHomepageLoading(true);
      setHomepageError('');
      const { data, error } = await supabase
        .from('resources')
        .select('id, subject_id, title, description, resource_type, academic_year, file_path, is_featured, download_count, created_at')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      if (!isMounted) return;
      if (error) {
        console.error('Could not load collection resources:', error.message);
        setHomepageError('The collection could not be loaded. Please refresh.');
        setHomepageLoading(false);
        return;
      }
      const rows = data || [];
      const subjectIds = [...new Set(rows.map(row => row.subject_id).filter(Boolean))];
      let subjectMap = {};
      if (subjectIds.length) {
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .select('id, name, semester, department_id')
          .in('id', subjectIds);
        if (subjectError) console.error('Could not load collection subject details:', subjectError.message);
        subjectMap = Object.fromEntries((subjectData || []).map(row => [String(row.id), row]));
      }
      if (!isMounted) return;
      const departmentMap = Object.fromEntries(departmentRows.map(row => [String(row.id), row.code]));
      setHomepageResources(rows.map(row => {
        const subject = subjectMap[String(row.subject_id)];
        return {
          id: row.id,
          title: row.title,
          subtitle: row.description || subject?.name || 'Academic resource',
          dept: departmentMap[String(subject?.department_id)] || 'GBPIET',
          sem: subject?.semester ? `Semester ${subject.semester}` : 'Semester —',
          type: row.resource_type || 'Resource',
          year: row.academic_year || '—',
          downloads: row.download_count || 0,
          date: formatResourceDate(row.created_at),
          createdAt: row.created_at,
          tag: row.is_featured ? 'FEATURED' : '',
          isFeatured: Boolean(row.is_featured),
          format: 'PDF',
          filePath: row.file_path
        };
      }));
      setHomepageLoading(false);
    }
    if (departmentRows.length) loadHomepageResources();
    else if (!homepageResources.length) setHomepageLoading(false);
    return () => { isMounted = false; };
  }, [departmentRows]);

  useEffect(() => {
    let isMounted = true;

    async function loadSubjectResources() {
      setSubjectResources([]);
      setResourceError('');

      if (!selectedSubject) {
        setResourceLoading(false);
        return;
      }

      setResourceLoading(true);
      const { data, error } = await supabase
        .from('resources')
        .select('id, title, description, resource_type, academic_year, file_path, download_count, created_at')
        .eq('subject_id', selectedSubject)
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (!isMounted) return;
      setResourceLoading(false);

      if (error) {
        console.error('Could not load subject resources:', error.message);
        setResourceError('Resources could not be loaded. Please try again.');
        return;
      }

      setSubjectResources(data || []);
    }

    loadSubjectResources();
    return () => { isMounted = false; };
  }, [selectedSubject]);


  useEffect(() => {
    let isMounted = true;

    async function loadSubjects() {
      setSubjects([]);
      setSelectedSubject('');
      setSubjectError('');

      if (!selectedDepartmentRow) return;

      setSubjectLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('id, name, code, semester')
        .eq('department_id', selectedDepartmentRow.id)
        .eq('semester', Number(selectedSemester))
        .order('name');

      if (!isMounted) return;
      setSubjectLoading(false);

      if (error) {
        console.error('Could not load subjects:', error.message);
        setSubjectError('Subjects could not be loaded. Please try again.');
        return;
      }

      setSubjects(data || []);
    }

    loadSubjects();
    return () => { isMounted = false; };
  }, [selectedDepartmentRow?.id, selectedSemester]);

  const displayedResources = selectedSubject
    ? subjectResources.map(item => ({
        id: item.id,
        title: item.title,
        subtitle: item.description || 'Academic resource',
        dept: department,
        sem: `Semester ${selectedSubjectRow?.semester || selectedSemester}`,
        type: item.resource_type || 'Resource',
        year: item.academic_year || '—',
        downloads: item.download_count || 0,
        date: formatResourceDate(item.created_at),
        createdAt: item.created_at,
        tag: '',
        isFeatured: false,
        format: 'PDF',
        filePath: item.file_path
      }))
    : homepageResources;

  const filtered = useMemo(() => {
    const matching = displayedResources.filter(item => {
      const haystack = `${item.title} ${item.subtitle} ${item.dept} ${item.type} ${item.year} ${item.sem}`.toLowerCase();
      const typeMatches = category === 'All resources' ||
        normalizeResourceType(item.type) === normalizeResourceType(category);
      return haystack.includes(query.toLowerCase()) &&
        (department === 'All departments' || item.dept === department) &&
        typeMatches;
    });
    return matching.sort((a, b) => {
      if (resourceSort === 'featured') return Number(b.isFeatured) - Number(a.isFeatured) || new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      if (resourceSort === 'downloads') return (b.downloads || 0) - (a.downloads || 0);
      if (resourceSort === 'title') return a.title.localeCompare(b.title);
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });
  }, [displayedResources, query, department, category, resourceSort]);

  const navItems = [
    { label: 'Overview', icon: House },
    { label: 'Resource library', icon: LibraryBig },
    { label: 'Previous papers', icon: FileText },
    { label: 'Community', icon: MessageSquare },
    { label: 'Announcements', icon: Megaphone },
    { label: 'Saved resources', icon: Bookmark }
  ];

  const changeNav = (label) => {
    setActive(label);
    setMenuOpen(false);
    if (label === 'Previous papers') setCategory('Previous papers');
    else if (label === 'Resource library' || label === 'Overview') setCategory('All resources');
  };

  const openResourcePreview = async (item) => {
    if (!item.filePath) {
      alert('This sample resource does not have a PDF attached yet.');
      return;
    }

    // Open a blank tab immediately so the browser does not block the popup
    // while Supabase generates the short-lived signed URL.
    const previewTab = window.open('about:blank', '_blank');
    if (!previewTab) {
      alert('Please allow pop-ups for this site, then try Preview again.');
      return;
    }

    const { data, error } = await supabase.storage
      .from('academic-resources')
      .createSignedUrl(item.filePath, 300);

    if (error || !data?.signedUrl) {
      console.error('Could not create PDF preview link:', error?.message);
      previewTab.close();
      alert(`Could not open this PDF: ${error?.message || 'Signed URL was not returned.'}`);
      return;
    }

    previewTab.location.href = data.signedUrl;
  };

  const downloadResource = async (item) => {
    if (!item.filePath) {
      alert('This sample resource does not have a PDF attached yet.');
      return;
    }

    const filename = item.filePath.split('/').pop() || 'pανthub-resource.pdf';
    const { data, error } = await supabase.storage
      .from('academic-resources')
      .createSignedUrl(item.filePath, 300, { download: filename });

    if (error || !data?.signedUrl) {
      console.error('Could not create PDF download link:', error?.message);
      alert(`Could not download this PDF: ${error?.message || 'Signed URL was not returned.'}`);
      return;
    }

    // Count the download using a database function (atomic increment).
    const { error: countError } = await supabase.rpc('increment_resource_download', {
      p_resource_id: item.id
    });

    if (countError) {
      console.error('PDF download started, but its count could not be updated:', countError.message);
    } else {
      setHomepageResources(current => current.map(resource =>
        String(resource.id) === String(item.id)
          ? { ...resource, downloads: (Number(resource.downloads) || 0) + 1 }
          : resource
      ));
      setSubjectResources(current => current.map(resource =>
        String(resource.id) === String(item.id)
          ? { ...resource, download_count: (Number(resource.download_count) || 0) + 1 }
          : resource
      ));
    }

    // Supabase adds a download disposition to the signed URL, prompting a file download.
    window.location.assign(data.signedUrl);
  };

  if (adminMode) {
    return (
      <div className="app-shell" data-theme={theme}>
        <div className="top-stripe" />
        <main className="main-area" style={{ gridColumn: '1 / -1', width: '100%', marginLeft: 0, minHeight: '100vh' }}>
          <div className="content-wrap" style={{ width: 'min(calc(100% - 48px), 980px)', maxWidth: 980, margin: '0 auto', boxSizing: 'border-box' }}>
            <header className="topbar">
              <div className="footer-brand">STACK<span>.</span> <small style={{ fontSize: 11, marginLeft: 10 }}>ADMIN</small></div>
              <button className="outline-button" onClick={handleAdminLogout}>Sign out</button>
            </header>
            <section className="library-section">
              <div className="eyebrow">ADMINISTRATION / 001</div>
              <h1 style={{ fontSize: 'clamp(32px, 5vw, 56px)' }}>Welcome to the <em>control room.</em></h1>
              <p className="hero-description">Signed in as {adminUser?.email}</p>
              <div className="resource-card" style={{ padding: 24, marginTop: 28 }}>
                <div className="eyebrow">STUDENT SUPPORT / 001</div>
                <h2>Resource requests</h2>
                <p>Review missing-resource requests submitted by students and update their status.</p>
                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', margin: '18px 0' }}>
                  <input value={requestSearch} onChange={e => setRequestSearch(e.target.value)} placeholder="Search name, subject, department or request..." aria-label="Search resource requests" style={{ flex: '1 1 260px', minWidth: 0, boxSizing: 'border-box' }} />
                  <button type="button" className="outline-button" onClick={loadAdminRequests} disabled={requestManageLoading}>
                    {requestManageLoading ? 'Refreshing…' : 'Refresh requests'}
                  </button>
                </div>
                {requestManageError && <p role="alert" style={{ color: 'var(--accent, #b34b35)' }}>{requestManageError}</p>}
                {requestManageMessage && <p role="status">{requestManageMessage}</p>}
                {requestManageLoading ? (
                  <p className="library-footer">LOADING REQUESTS…</p>
                ) : filteredAdminRequests.length === 0 ? (
                  <p className="library-footer">NO MATCHING REQUESTS FOUND.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 12 }}>
                    {filteredAdminRequests.map(item => {
                      const dept = adminDepartments.find(row => String(row.id) === String(item.department_id));
                      const subject = adminSubjects.find(row => String(row.id) === String(item.subject_id));
                      return (
                        <article key={item.id} style={{ border: '1px solid var(--line, #d8d0c5)', padding: 14 }}>
                          <div className="eyebrow">{(dept?.code || 'DEPARTMENT') + ' · SEMESTER ' + item.semester + ' · ' + item.status.toUpperCase()}</div>
                          <h3 style={{ margin: '7px 0 4px' }}>{item.resource_type} — {subject?.name || 'Subject unavailable'}</h3>
                          <p style={{ margin: '4px 0', color: 'var(--muted)' }}>Requested by: {item.student_name} · {formatResourceDate(item.created_at)}</p>
                          <p style={{ margin: '8px 0', whiteSpace: 'pre-wrap' }}>{item.description}</p>
                          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                            <button type="button" className="outline-button" disabled={requestManageBusy || item.status === 'pending'} onClick={() => updateResourceRequestStatus(item, 'pending')}>Mark pending</button>
                            <button type="button" className="outline-button" disabled={requestManageBusy || item.status === 'fulfilled'} onClick={() => updateResourceRequestStatus(item, 'fulfilled')}>Mark fulfilled</button>
                            <button type="button" className="outline-button" disabled={requestManageBusy || item.status === 'rejected'} onClick={() => updateResourceRequestStatus(item, 'rejected')}>Reject</button>
                            <button type="button" className="text-button" disabled={requestManageBusy} onClick={() => deleteResourceRequest(item)}>Delete</button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="resource-card" style={{ padding: 24, marginTop: 28 }}>
                <div className="eyebrow">COMMUNITY MODERATION / 001</div>
                <h2>Community reports</h2>
                <p>Review student reports, hide inappropriate content or restore content after review.</p>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', margin: '16px 0' }}>
                  <button type="button" className="outline-button" onClick={loadAdminCommunityReports}>Refresh reports</button>
                  <span className="library-footer">{adminCommunityReports.length} REPORTS</span>
                </div>
                {communityAdminError && <p role="alert" style={{ color: 'var(--accent, #b34b35)' }}>{communityAdminError}</p>}
                {communityAdminMessage && <p role="status">{communityAdminMessage}</p>}
                {adminCommunityReports.length === 0 ? <p className="library-footer">NO COMMUNITY REPORTS YET.</p> :
                  <div style={{ display: 'grid', gap: 12 }}>
                    {adminCommunityReports.map(report => (
                      <article key={report.id} style={{ border: '1px solid var(--line, #d8d0c5)', padding: 14 }}>
                        <div className="eyebrow">{report.targetType.toUpperCase()} REPORT · {report.status.toUpperCase()} · {formatResourceDate(report.created_at)}</div>
                        <p><strong>Reason:</strong> {report.reason}</p>
                        {report.target ? <>
                          <p style={{ marginBottom: 4 }}><strong>Reported by:</strong> {report.target.nickname}</p>
                          {report.target.title && <h3 style={{ margin: '6px 0' }}>{report.target.title}</h3>}
                          <p style={{ whiteSpace: 'pre-wrap' }}>{report.target.body}</p>
                          <p className="library-footer">CONTENT STATUS: {report.target.is_hidden ? 'HIDDEN' : 'VISIBLE'}</p>
                        </> : <p className="library-footer">REPORTED CONTENT IS NO LONGER AVAILABLE.</p>}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {report.target && <button type="button" className="outline-button" disabled={communityAdminBusy} onClick={() => moderateCommunityTarget(report, report.target.is_hidden ? 'restore' : 'hide')}>{report.target.is_hidden ? 'Restore content' : 'Hide content'}</button>}
                          <button type="button" className="outline-button" disabled={communityAdminBusy || report.status === 'reviewed'} onClick={() => updateCommunityReportStatus(report, 'reviewed')}>Mark reviewed</button>
                          <button type="button" className="outline-button" disabled={communityAdminBusy || report.status === 'dismissed'} onClick={() => updateCommunityReportStatus(report, 'dismissed')}>Dismiss</button>
                          <button type="button" className="text-button" disabled={communityAdminBusy} onClick={() => deleteCommunityReport(report)}>Delete report</button>
                        </div>
                      </article>
                    ))}
                  </div>}
              </div>

              <div className="resource-card" style={{ padding: 24, marginTop: 28 }}>
                <div className="eyebrow">COMMUNICATION / 001</div>
                <h2>Announcements management</h2>
                <p>Create notices for students. New announcements are saved as drafts until you publish them.</p>

                <form onSubmit={addAdminAnnouncement} style={{ display: 'grid', gap: 12, marginTop: 20 }}>
                  <label>
                    <span>ANNOUNCEMENT TITLE</span>
                    <input value={announcementForm.title} onChange={e => setAnnouncementForm(v => ({ ...v, title: e.target.value }))} placeholder="e.g. Mid-semester examination schedule" required maxLength={180} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                  </label>
                  <label>
                    <span>MESSAGE</span>
                    <textarea value={announcementForm.body} onChange={e => setAnnouncementForm(v => ({ ...v, body: e.target.value }))} placeholder="Write the announcement details..." required rows={4} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                  </label>
                  <div><button type="submit" className="primary-button" disabled={announcementManageBusy}>Save as draft <Plus size={15}/></button></div>
                </form>

                {announcementManageError && <p role="alert" style={{ color: 'var(--accent, #b34b35)' }}>{announcementManageError}</p>}
                {announcementManageMessage && <p role="status">{announcementManageMessage}</p>}
                <div style={{ display: 'grid', gap: 12, marginTop: 18 }}>
                  {adminAnnouncements.map(item => {
                    const editing = editingAnnouncementId === item.id;
                    return (
                      <article key={item.id} style={{ border: '1px solid var(--line, #d8d0c5)', padding: 14 }}>
                        {editing ? (
                          <div style={{ display: 'grid', gap: 10 }}>
                            <label><span>TITLE</span>
                              <input value={editAnnouncementForm.title} onChange={e => setEditAnnouncementForm(v => ({ ...v, title: e.target.value }))} maxLength={180} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                            </label>
                            <label><span>MESSAGE</span>
                              <textarea value={editAnnouncementForm.body} onChange={e => setEditAnnouncementForm(v => ({ ...v, body: e.target.value }))} rows={4} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                            </label>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                              <button type="button" className="primary-button" disabled={announcementManageBusy} onClick={() => saveAdminAnnouncement(item)}>Save changes</button>
                              <button type="button" className="outline-button" onClick={() => setEditingAnnouncementId(null)}>Cancel</button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="eyebrow">{item.is_published ? 'PUBLISHED' : 'DRAFT'} · {formatResourceDate(item.created_at)}</div>
                            <h3 style={{ margin: '7px 0 4px' }}>{item.title}</h3>
                            <p style={{ margin: 0, color: 'var(--muted)', whiteSpace: 'pre-wrap' }}>{item.body}</p>
                            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                              <button type="button" className="outline-button" onClick={() => startAnnouncementEdit(item)}>Edit</button>
                              <button type="button" className="outline-button" disabled={announcementManageBusy} onClick={() => toggleAnnouncementPublished(item)}>{item.is_published ? 'Unpublish' : 'Publish'}</button>
                              <button type="button" className="text-button" disabled={announcementManageBusy} onClick={() => deleteAdminAnnouncement(item)}>Delete</button>
                            </div>
                          </>
                        )}
                      </article>
                    );
                  })}
                  {adminAnnouncements.length === 0 && <p className="library-footer">NO ANNOUNCEMENTS YET.</p>}
                </div>
              </div>

              <div className="resource-card" style={{ padding: 24, marginTop: 28 }}>
                <div className="eyebrow">ACADEMIC STRUCTURE / 000</div>
                <h2>Department management</h2>
                <p>Add and maintain departments. A department cannot be deleted while it still has subjects.</p>

                <form onSubmit={addAdminDepartment} style={{ display: 'grid', gap: 12, marginTop: 20 }}>
                  <div className="filter-row">
                    <label style={{ flex: '1 1 240px' }}>
                      <span>DEPARTMENT NAME</span>
                      <input value={departmentForm.name} onChange={e => setDepartmentForm(v => ({ ...v, name: e.target.value }))} placeholder="e.g. Computer Science and Engineering" required style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                    </label>
                    <label style={{ flex: '1 1 160px' }}>
                      <span>DEPARTMENT CODE</span>
                      <input value={departmentForm.code} onChange={e => setDepartmentForm(v => ({ ...v, code: e.target.value.toUpperCase() }))} placeholder="e.g. CSE" required maxLength={20} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                    </label>
                  </div>
                  <div><button type="submit" className="primary-button" disabled={departmentManageBusy}>Add department <Plus size={15}/></button></div>
                </form>

                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input value={departmentManageSearch} onChange={e => setDepartmentManageSearch(e.target.value)} placeholder="Search departments or codes..." aria-label="Search departments" style={{ flex: '1 1 260px', minWidth: 0, boxSizing: 'border-box' }} />
                    <span className="library-footer">{filteredAdminDepartments.length} DEPARTMENTS</span>
                  </div>
                  {departmentManageError && <p role="alert" style={{ color: 'var(--accent, #b34b35)' }}>{departmentManageError}</p>}
                  {departmentManageMessage && <p role="status">{departmentManageMessage}</p>}
                  <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                    {filteredAdminDepartments.map(dept => {
                      const editing = editingDepartmentId === dept.id;
                      const subjectCount = adminSubjects.filter(subject => String(subject.department_id) === String(dept.id)).length;
                      return (
                        <article key={dept.id} style={{ border: '1px solid var(--line, #d8d0c5)', padding: 14 }}>
                          {editing ? (
                            <div style={{ display: 'grid', gap: 10 }}>
                              <label><span>DEPARTMENT NAME</span>
                                <input value={editDepartmentForm.name} onChange={e => setEditDepartmentForm(v => ({ ...v, name: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                              </label>
                              <label><span>DEPARTMENT CODE</span>
                                <input value={editDepartmentForm.code} onChange={e => setEditDepartmentForm(v => ({ ...v, code: e.target.value.toUpperCase() }))} maxLength={20} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                              </label>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button type="button" className="primary-button" disabled={departmentManageBusy} onClick={() => saveAdminDepartment(dept)}>Save changes</button>
                                <button type="button" className="outline-button" onClick={() => setEditingDepartmentId(null)}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="eyebrow">{dept.code}</div>
                              <h3 style={{ margin: '7px 0 4px' }}>{dept.name}</h3>
                              <p style={{ margin: 0, color: 'var(--muted)' }}>{subjectCount} linked subject{subjectCount === 1 ? '' : 's'}</p>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                                <button type="button" className="outline-button" onClick={() => startDepartmentEdit(dept)}>Edit department</button>
                                <button type="button" className="text-button" disabled={departmentManageBusy} onClick={() => deleteAdminDepartment(dept)}>Delete department</button>
                              </div>
                            </>
                          )}
                        </article>
                      );
                    })}
                    {filteredAdminDepartments.length === 0 && <p className="library-footer">NO MATCHING DEPARTMENTS FOUND.</p>}
                  </div>
                </div>
              </div>

              <div className="resource-card" style={{ padding: 24, marginTop: 28 }}>
                <div className="eyebrow">ACADEMIC STRUCTURE / 001</div>
                <h2>Subject management</h2>
                <p>Add and maintain subjects for each department and semester. Subjects with linked resources cannot be deleted.</p>

                <form onSubmit={addAdminSubject} style={{ display: 'grid', gap: 12, marginTop: 20 }}>
                  <div className="filter-row">
                    <label style={{ flex: '1 1 220px' }}>
                      <span>DEPARTMENT</span>
                      <select value={subjectForm.departmentId} onChange={e => setSubjectForm(v => ({ ...v, departmentId: e.target.value }))} required style={{ width: '100%', marginTop: 6 }}>
                        <option value="">Choose department</option>
                        {adminDepartments.map(dept => <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>)}
                      </select>
                    </label>
                    <label style={{ flex: '1 1 140px' }}>
                      <span>SEMESTER</span>
                      <select value={subjectForm.semester} onChange={e => setSubjectForm(v => ({ ...v, semester: e.target.value }))} style={{ width: '100%', marginTop: 6 }}>
                        {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                      </select>
                    </label>
                  </div>
                  <div className="filter-row">
                    <label style={{ flex: '1 1 240px' }}>
                      <span>SUBJECT NAME</span>
                      <input value={subjectForm.name} onChange={e => setSubjectForm(v => ({ ...v, name: e.target.value }))} placeholder="e.g. Database Management Systems" required style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                    </label>
                    <label style={{ flex: '1 1 180px' }}>
                      <span>SUBJECT CODE (OPTIONAL)</span>
                      <input value={subjectForm.code} onChange={e => setSubjectForm(v => ({ ...v, code: e.target.value }))} placeholder="e.g. BCS-401" style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                    </label>
                  </div>
                  <div><button type="submit" className="primary-button" disabled={subjectManageBusy}>Add subject <Plus size={15}/></button></div>
                </form>

                <div style={{ marginTop: 24 }}>
                  <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
                    <input value={subjectManageSearch} onChange={e => setSubjectManageSearch(e.target.value)} placeholder="Search subjects, codes, departments..." aria-label="Search subjects" style={{ flex: '1 1 260px', minWidth: 0, boxSizing: 'border-box' }} />
                    <span className="library-footer">{filteredAdminSubjects.length} SUBJECTS</span>
                  </div>
                  {subjectManageError && <p role="alert" style={{ color: 'var(--accent, #b34b35)' }}>{subjectManageError}</p>}
                  {subjectManageMessage && <p role="status">{subjectManageMessage}</p>}
                  <div style={{ display: 'grid', gap: 12, marginTop: 14 }}>
                    {filteredAdminSubjects.map(subject => {
                      const dept = adminDepartments.find(row => String(row.id) === String(subject.department_id));
                      const editing = editingSubjectId === subject.id;
                      return (
                        <article key={subject.id} style={{ border: '1px solid var(--line, #d8d0c5)', padding: 14 }}>
                          {editing ? (
                            <div style={{ display: 'grid', gap: 10 }}>
                              <label><span>DEPARTMENT</span>
                                <select value={editSubjectForm.departmentId} onChange={e => setEditSubjectForm(v => ({ ...v, departmentId: e.target.value }))} style={{ width: '100%', marginTop: 6 }}>
                                  {adminDepartments.map(row => <option key={row.id} value={row.id}>{row.name} ({row.code})</option>)}
                                </select>
                              </label>
                              <label><span>SEMESTER</span>
                                <select value={editSubjectForm.semester} onChange={e => setEditSubjectForm(v => ({ ...v, semester: e.target.value }))} style={{ width: '100%', marginTop: 6 }}>
                                  {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                                </select>
                              </label>
                              <label><span>SUBJECT NAME</span>
                                <input value={editSubjectForm.name} onChange={e => setEditSubjectForm(v => ({ ...v, name: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                              </label>
                              <label><span>SUBJECT CODE</span>
                                <input value={editSubjectForm.code} onChange={e => setEditSubjectForm(v => ({ ...v, code: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                              </label>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button type="button" className="primary-button" disabled={subjectManageBusy} onClick={() => saveAdminSubject(subject)}>Save changes</button>
                                <button type="button" className="outline-button" onClick={() => setEditingSubjectId(null)}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="eyebrow">{dept?.code || 'DEPARTMENT'} · SEMESTER {subject.semester}</div>
                              <h3 style={{ margin: '7px 0 4px' }}>{subject.name}</h3>
                              <p style={{ margin: 0, color: 'var(--muted)' }}>{subject.code || 'No subject code'}</p>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                                <button type="button" className="outline-button" onClick={() => startSubjectEdit(subject)}>Edit subject</button>
                                <button type="button" className="text-button" disabled={subjectManageBusy} onClick={() => deleteAdminSubject(subject)}>Delete subject</button>
                              </div>
                            </>
                          )}
                        </article>
                      );
                    })}
                    {filteredAdminSubjects.length === 0 && <p className="library-footer">NO MATCHING SUBJECTS FOUND.</p>}
                  </div>
                </div>
              </div>

              <div className="resource-card" style={{ padding: 24, marginTop: 28 }}>
                <div className="eyebrow">RESOURCE MANAGEMENT / 001</div>
                <h2>Manage academic resources</h2>
                <p>Review uploaded PDFs, update their details, control publication, or remove test and outdated resources.</p>

                <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', margin: '20px 0' }}>
                  <input
                    value={resourceSearch}
                    onChange={event => setResourceSearch(event.target.value)}
                    placeholder="Search title, subject, department..."
                    aria-label="Search admin resources"
                    style={{ flex: '1 1 240px', minWidth: 0, boxSizing: 'border-box' }}
                  />
                  <button type="button" className="outline-button" onClick={loadAdminResources} disabled={resourceManageLoading}>
                    {resourceManageLoading ? 'Refreshing…' : 'Refresh list'}
                  </button>
                </div>

                {resourceManageError && <p role="alert">{resourceManageError}</p>}
                {resourceManageMessage && <p role="status">{resourceManageMessage}</p>}
                {resourceManageLoading ? (
                  <p className="library-footer">LOADING RESOURCES…</p>
                ) : filteredAdminResources.length === 0 ? (
                  <p className="library-footer">NO MATCHING RESOURCES FOUND.</p>
                ) : (
                  <div style={{ display: 'grid', gap: 14 }}>
                    {filteredAdminResources.map(item => {
                      const subject = adminSubjects.find(row => String(row.id) === String(item.subject_id));
                      const dept = adminDepartments.find(row => String(row.id) === String(subject?.department_id));
                      const isEditing = editingResourceId === item.id;
                      const subjectChoices = adminSubjects.filter(row =>
                        !dept || String(row.department_id) === String(dept.id)
                      );
                      return (
                        <article key={item.id} style={{ border: '1px solid var(--line, #d8d0c5)', padding: 16 }}>
                          {isEditing ? (
                            <div style={{ display: 'grid', gap: 12 }}>
                              <label><span>RESOURCE TITLE</span>
                                <input value={editResource.title} onChange={e => setEditResource(v => ({ ...v, title: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                              </label>
                              <label><span>DESCRIPTION</span>
                                <textarea value={editResource.description} onChange={e => setEditResource(v => ({ ...v, description: e.target.value }))} rows={2} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                              </label>
                              <label><span>SUBJECT</span>
                                <select value={editResource.subject_id} onChange={e => setEditResource(v => ({ ...v, subject_id: e.target.value }))} style={{ width: '100%', marginTop: 6 }}>
                                  {subjectChoices.map(row => <option key={row.id} value={row.id}>{row.name} · Semester {row.semester}</option>)}
                                </select>
                              </label>
                              <div className="filter-row">
                                <label style={{ flex: '1 1 180px' }}><span>RESOURCE TYPE</span>
                                  <select value={editResource.resource_type} onChange={e => setEditResource(v => ({ ...v, resource_type: e.target.value }))} style={{ width: '100%', marginTop: 6 }}>
                                    {['Notes', 'Previous Papers', 'Assignments', 'Lab Manuals', 'Syllabus'].map(type => <option key={type}>{type}</option>)}
                                  </select>
                                </label>
                                <label style={{ flex: '1 1 150px' }}><span>ACADEMIC YEAR</span>
                                  <input value={editResource.academic_year} onChange={e => setEditResource(v => ({ ...v, academic_year: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                                </label>
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                                <button type="button" className="primary-button" disabled={resourceActionBusy} onClick={() => saveResourceEdit(item)}>Save changes</button>
                                <button type="button" className="outline-button" onClick={() => setEditingResourceId(null)}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
                                <div style={{ minWidth: 0, flex: '1 1 260px' }}>
                                  <div className="eyebrow">{(dept?.code || 'DEPARTMENT') + ' · ' + (subject ? `SEMESTER ${subject.semester}` : 'SUBJECT UNKNOWN')}</div>
                                  <h3 style={{ margin: '8px 0 4px' }}>{item.title}</h3>
                                  <p style={{ margin: 0, color: 'var(--muted)' }}>{subject?.name || 'Subject unavailable'} · {item.resource_type} · {item.academic_year || 'Year not set'}</p>
                                  {item.description && <p style={{ marginTop: 8 }}>{item.description}</p>}
                                  <p className="library-footer" style={{ marginTop: 8 }}>{item.download_count || 0} downloads · {item.is_published ? 'Published' : 'Unpublished'}</p>
                                </div>
                                <span className="tag" style={{ alignSelf: 'flex-start' }}>{item.is_published ? 'PUBLISHED' : 'HIDDEN'}</span>
                              </div>
                              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 14 }}>
                                <button type="button" className="outline-button" onClick={() => beginResourceEdit(item)}>Edit details</button>
                                <button type="button" className="outline-button" disabled={resourceActionBusy} onClick={() => toggleResourcePublished(item)}>{item.is_published ? 'Unpublish' : 'Publish'}</button>
                                <button type="button" className="outline-button" disabled={resourceActionBusy} onClick={() => toggleResourceFeatured(item)}>{item.is_featured ? 'Unfeature' : 'Feature'}</button>
                                <button type="button" className="text-button" disabled={resourceActionBusy} onClick={() => deleteAdminResource(item)}>Delete resource</button>
                              </div>
                            </>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="resource-card" style={{ padding: 24, marginTop: 24 }}>
                <div className="eyebrow">RESOURCE MANAGEMENT / 002</div>
                <h2>Upload academic PDFs</h2>
                <p>Add one or several PDFs. Each file gets its own department, semester, subject, title and resource details.</p>
                <label style={{ display: 'block', margin: '20px 0' }}>
                  <span>CHOOSE PDF FILES</span>
                  <input type="file" accept="application/pdf,.pdf" multiple
                    onChange={event => { addUploadFiles(event.target.files); event.target.value = ''; }}
                    style={{ display: 'block', width: '100%', marginTop: 8 }} />
                </label>

                {uploadItems.map(item => {
                  const availableSubjects = adminSubjects.filter(subject =>
                    String(subject.department_id) === String(item.departmentId) &&
                    Number(subject.semester) === Number(item.semester)
                  );
                  return (
                    <div key={item.key} style={{ border: '1px solid var(--line, #d8d0c5)', padding: 16, marginTop: 16 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                        <strong>{item.file.name}</strong>
                        <button type="button" className="text-button" onClick={() => setUploadItems(items => items.filter(row => row.key !== item.key))}>Remove</button>
                      </div>
                      <div className="filter-row" style={{ marginTop: 14 }}>
                        <label style={{ flex: '1 1 220px' }}>
                          <span>RESOURCE TITLE</span>
                          <input value={item.title} onChange={e => updateUploadItem(item.key, 'title', e.target.value)} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} required />
                        </label>
                        <label style={{ flex: '1 1 220px' }}>
                          <span>DEPARTMENT</span>
                          <select value={item.departmentId} onChange={e => updateUploadItem(item.key, 'departmentId', e.target.value)} style={{ width: '100%', marginTop: 6 }}>
                            <option value="">Choose department</option>
                            {adminDepartments.map(dept => <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>)}
                          </select>
                        </label>
                        <label style={{ flex: '1 1 140px' }}>
                          <span>SEMESTER</span>
                          <select value={item.semester} onChange={e => updateUploadItem(item.key, 'semester', e.target.value)} style={{ width: '100%', marginTop: 6 }}>
                            {Array.from({ length: 8 }, (_, index) => String(index + 1)).map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                          </select>
                        </label>
                        <label style={{ flex: '1 1 240px' }}>
                          <span>SUBJECT</span>
                          <select value={item.subjectId} onChange={e => updateUploadItem(item.key, 'subjectId', e.target.value)} style={{ width: '100%', marginTop: 6 }}>
                            <option value="">Choose subject</option>
                            {availableSubjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                          </select>
                        </label>
                        <label style={{ flex: '1 1 180px' }}>
                          <span>RESOURCE TYPE</span>
                          <select value={item.resourceType} onChange={e => updateUploadItem(item.key, 'resourceType', e.target.value)} style={{ width: '100%', marginTop: 6 }}>
                            {['Notes', 'Previous Papers', 'Assignments', 'Lab Manuals', 'Syllabus'].map(type => <option key={type} value={type}>{type}</option>)}
                          </select>
                        </label>
                        <label style={{ flex: '1 1 150px' }}>
                          <span>ACADEMIC YEAR</span>
                          <input value={item.academicYear} onChange={e => updateUploadItem(item.key, 'academicYear', e.target.value)} placeholder="2025-26" style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                        </label>
                        <label style={{ flex: '1 1 100%' }}>
                          <span>DESCRIPTION (OPTIONAL)</span>
                          <input value={item.description} onChange={e => updateUploadItem(item.key, 'description', e.target.value)} placeholder="Brief description of this PDF" style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                        </label>
                      </div>
                    </div>
                  );
                })}

                {uploadMessage && <p role="status" style={{ marginTop: 16 }}>{uploadMessage}</p>}
                <button type="button" className="primary-button" disabled={uploadBusy || uploadItems.length === 0} onClick={uploadSelectedResources} style={{ marginTop: 20 }}>
                  {uploadBusy ? 'Uploading…' : `Upload and publish ${uploadItems.length || ''} PDF${uploadItems.length === 1 ? '' : 's'}`} <ArrowUpRight size={15}/>
                </button>
              </div>
            </section>
          </div>
        </main>
      </div>
    );
  }

  if (adminMode === false && active === 'Admin login') {
    return (
      <div className="app-shell" data-theme={theme}>
        <div className="top-stripe" />
        <main className="main-area" style={{ gridColumn: '1 / -1', width: '100%', marginLeft: 0, minHeight: '100vh' }}>
          <div className="content-wrap" style={{ width: 'min(calc(100% - 48px), 560px)', maxWidth: 560, margin: '0 auto', boxSizing: 'border-box' }}>
            <header className="topbar">
              <div className="footer-brand">STACK<span>.</span></div>
              <button className="text-button" onClick={() => { setActive('Overview'); setAdminError(''); }}>Back to website <ArrowRight size={14}/></button>
            </header>
            <section className="library-section">
              <div className="eyebrow">RESTRICTED AREA / ADMINISTRATOR</div>
              <h1 style={{ fontSize: 'clamp(34px, 5vw, 54px)' }}>Admin <em>sign in.</em></h1>
              <p className="hero-description">Sign in with the administrator account created in Supabase.</p>
              <form onSubmit={handleAdminLogin} className="search-panel" style={{ padding: 24, marginTop: 24 }}>
                <label style={{ display: 'block', marginBottom: 16 }}>
                  <span>EMAIL ADDRESS</span>
                  <input type="email" value={adminEmail} onChange={e => setAdminEmail(e.target.value)} autoComplete="username" required style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', marginTop: 8 }} />
                </label>
                <label style={{ display: 'block', marginBottom: 16 }}>
                  <span>PASSWORD</span>
                  <input type="password" value={adminPassword} onChange={e => setAdminPassword(e.target.value)} autoComplete="current-password" required style={{ width: '100%', maxWidth: '100%', boxSizing: 'border-box', marginTop: 8 }} />
                </label>
                {adminError && <p role="alert" style={{ color: 'var(--accent, #b34b35)' }}>{adminError}</p>}
                <button className="primary-button" type="submit" disabled={adminLoading}>
                  {adminLoading ? 'Checking access…' : 'Sign in'} <ArrowUpRight size={15}/>
                </button>
              </form>
              <p className="library-footer">Student browsing does not require an account.</p>
            </section>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="app-shell" data-theme={theme}>
      <div className="top-stripe" />
      <aside className={`sidebar ${menuOpen ? 'sidebar-open' : ''}`}>
        <div className="brand-row">
          <div className="brand-mark">S.</div>
          <div className="brand-word">STACK<span>.</span></div>
          <button className="icon-button mobile-close" onClick={() => setMenuOpen(false)} aria-label="Close menu"><X size={18}/></button>
        </div>
        <div className="workspace-block">
          <div className="eyebrow">WORKSPACE</div>
          <button className="workspace-switch"><span className="college-mark">G</span><span>GBPIET · B.Tech</span><ChevronDown size={14}/></button>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          <div className="eyebrow nav-heading">YOUR SPACE</div>
          {navItems.map(({label, icon: Icon}) => (
            <button key={label} onClick={() => changeNav(label)} className={`nav-link ${active === label ? 'active' : ''}`}>
              <Icon size={17} strokeWidth={1.8}/><span>{label}</span>
              {label === 'Announcements' && <i className="nav-dot"/>}
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="eyebrow">QUICK ACCESS</div>
          <button className="quick-link" onClick={() => {setCategory('Notes'); setActive('Resource library')}}><span className="quick-square orange">N</span> Notes</button>
          <button className="quick-link" onClick={() => {setCategory('Previous papers'); setActive('Previous papers')}}><span className="quick-square ink">P</span> Question papers</button>
          <button className="quick-link" onClick={() => {setCategory('Lab manuals'); setActive('Resource library')}}><span className="quick-square green">L</span> Lab manuals</button>
          <div className="sidebar-note"><span className="tiny-star">✳</span> Made for the GBPIET student community.</div>
        </div>
      </aside>

      {menuOpen && <button className="scrim" onClick={() => setMenuOpen(false)} aria-label="Close navigation"/>}

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button menu-trigger" onClick={() => setMenuOpen(true)} aria-label="Open menu"><Menu size={19}/></button>
            <span className="breadcrumb">GBPIET <span>/</span> {active}</span>
          </div>
          <div className="topbar-actions">
            <div className="status-pill"><span className="status-light"/> RESOURCE COMMONS</div>
            <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')} aria-label="Toggle appearance">
              {theme === 'light' ? <Moon size={16}/> : <Sun size={16}/>}<span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
            </button>
            <button className="text-button" onClick={() => { setActive('Admin login'); setAdminError(''); }}>Admin</button>
            <div className="avatar">S</div>
          </div>
        </header>

        <div className="content-wrap">
          {active === 'Community' ? (
            <section className="library-section" style={{ paddingTop: 28 }}>
              <div className="eyebrow">THE COMMON ROOM / 003</div>
              <h1>Ideas grow <em>together.</em></h1>
              <p className="hero-description">Ask questions, share what you know and discuss your subjects with fellow GBPIET students.</p>

              <div className="resource-card" style={{ padding: 22, marginTop: 24 }}>
                <h2>Start a discussion</h2>
                <form onSubmit={submitCommunityPost} style={{ display: 'grid', gap: 12, marginTop: 16 }}>
                  <label><span>NICKNAME</span>
                    <input value={communityForm.nickname} onChange={e => setCommunityForm(v => ({ ...v, nickname: e.target.value }))} placeholder="Choose a display name" maxLength={40} required style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                  </label>
                  <div className="filter-row">
                    <label style={{ flex: '1 1 180px' }}><span>DEPARTMENT (OPTIONAL)</span>
                      <select value={communityForm.departmentId} onChange={e => setCommunityForm(v => ({ ...v, departmentId: e.target.value, subjectId: '' }))} style={{ width: '100%', marginTop: 6 }}>
                        <option value="">General discussion</option>
                        {departmentRows.map(d => <option key={d.id} value={d.id}>{d.name} ({d.code})</option>)}
                      </select>
                    </label>
                    {communityForm.departmentId && <label style={{ flex: '1 1 120px' }}><span>SEMESTER</span>
                      <select value={communityForm.semester} onChange={e => setCommunityForm(v => ({ ...v, semester: e.target.value, subjectId: '' }))} style={{ width: '100%', marginTop: 6 }}>
                        {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(n => <option key={n} value={n}>Semester {n}</option>)}
                      </select>
                    </label>}
                  </div>
                  {communityForm.departmentId && <label><span>SUBJECT (OPTIONAL)</span>
                    <select value={communityForm.subjectId} onChange={e => setCommunityForm(v => ({ ...v, subjectId: e.target.value }))} style={{ width: '100%', marginTop: 6 }}>
                      <option value="">Department discussion</option>
                      {communitySubjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                    </select>
                  </label>}
                  <label><span>DISCUSSION TITLE</span>
                    <input value={communityForm.title} onChange={e => setCommunityForm(v => ({ ...v, title: e.target.value }))} placeholder="What would you like to discuss?" maxLength={180} required style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                  </label>
                  <label><span>MESSAGE</span>
                    <textarea value={communityForm.body} onChange={e => setCommunityForm(v => ({ ...v, body: e.target.value }))} placeholder="Write your question or share an idea..." rows={4} maxLength={5000} required style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                  </label>
                  <button type="submit" className="primary-button" disabled={communitySubmitting || !communityUser}>{communitySubmitting ? 'Posting…' : 'Publish discussion'} <ArrowUpRight size={15}/></button>
                </form>
                <p className="library-footer">No student account required. Your nickname is visible to other students.</p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', marginTop: 34 }}>
                <h2 style={{ margin: 0 }}>Discussions</h2>
                <div className="view-switch">
                  <button className={communityFilter === 'all' ? 'selected' : ''} onClick={() => setCommunityFilter('all')}>All</button>
                  <button className={communityFilter === 'general' ? 'selected' : ''} onClick={() => setCommunityFilter('general')}>General</button>
                  <button className={communityFilter === 'subject' ? 'selected' : ''} onClick={() => setCommunityFilter('subject')}>Subject</button>
                </div>
              </div>
              {communityError && <p role="alert" style={{ color: 'var(--accent, #b34b35)' }}>{communityError}</p>}
              {communityMessage && <p role="status">{communityMessage}</p>}
              {communityLoading ? <p className="library-footer">LOADING DISCUSSIONS…</p> :
                communityPosts.length === 0 ? <p className="library-footer">NO DISCUSSIONS YET. START THE FIRST ONE.</p> :
                <div style={{ display: 'grid', gap: 14, marginTop: 16 }}>
                  {communityPosts.map(post => {
                    const dept = departmentRows.find(d => d.id === post.department_id);
                    const subject = adminSubjects.find(x => x.id === post.subject_id) || subjects.find(x => x.id === post.subject_id);
                    const own = communityUser?.id === post.author_id;
                    const editing = editingPostId === post.id;
                    return <article key={post.id} className="resource-card" style={{ padding: 20 }}>
                      <div className="eyebrow">{post.subject_id ? (subject?.name || 'SUBJECT DISCUSSION') : dept ? `${dept.code} · DEPARTMENT` : 'GENERAL DISCUSSION'} · {formatResourceDate(post.created_at)}</div>
                      {editing ? <div style={{ display: 'grid', gap: 10 }}>
                        <input value={editPostForm.title} onChange={e => setEditPostForm(v => ({ ...v, title: e.target.value }))} maxLength={180}/>
                        <textarea value={editPostForm.body} onChange={e => setEditPostForm(v => ({ ...v, body: e.target.value }))} rows={4}/>
                        <div style={{ display: 'flex', gap: 8 }}><button className="primary-button" type="button" disabled={communityBusy} onClick={() => saveCommunityPostEdit(post)}>Save</button><button className="outline-button" type="button" onClick={() => setEditingPostId(null)}>Cancel</button></div>
                      </div> : <>
                        <h3 style={{ margin: '10px 0 6px' }}>{post.title}</h3>
                        <p style={{ whiteSpace: 'pre-wrap' }}>{post.body}</p>
                        <p className="library-footer">BY {post.nickname} · {dept?.code || 'GBPIET'}</p>
                      </>}
                      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                        <button className="outline-button" type="button" onClick={() => togglePostReplies(post.id)}>{expandedPostId === post.id ? 'Hide replies' : 'Replies'}</button>
                        <button className="text-button" type="button" onClick={() => reportCommunityPost(post)}>Report</button>
                        {own && !editing && <><button className="text-button" type="button" onClick={() => { setEditingPostId(post.id); setEditPostForm({ title: post.title, body: post.body }); }}>Edit</button><button className="text-button" type="button" disabled={communityBusy} onClick={() => deleteCommunityPost(post)}>Delete</button></>}
                      </div>
                      {expandedPostId === post.id && <div style={{ borderTop: '1px solid var(--line, #d8d0c5)', marginTop: 16, paddingTop: 14 }}>
                        {(communityReplies[post.id] || []).map(reply => <div key={reply.id} style={{ padding: '10px 0', borderBottom: '1px solid var(--line, #d8d0c5)' }}>
                          <p style={{ margin: '0 0 5px', whiteSpace: 'pre-wrap' }}>{reply.body}</p>
                          <span className="library-footer">{reply.nickname} · {formatResourceDate(reply.created_at)}</span>
                          <button type="button" className="text-button" onClick={() => reportCommunityReply(reply)}>Report reply</button>
                        </div>)}
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
                          <input value={replyDrafts[post.id] || ''} onChange={e => setReplyDrafts(v => ({ ...v, [post.id]: e.target.value }))} placeholder="Write a reply…" maxLength={2000} style={{ flex: '1 1 220px', minWidth: 0 }}/>
                          <button className="primary-button" type="button" disabled={communityBusy || !(replyDrafts[post.id] || '').trim()} onClick={() => submitCommunityReply(post)}>Reply</button>
                        </div>
                      </div>}
                    </article>;
                  })}
                </div>}
            </section>
          ) : (
          <>
          <section className="hero">
            <div className="hero-copy">
              <div className="eyebrow hero-kicker"><span className="kicker-line"/> THE GBPIET RESOURCE COMMONS <span className="issue">VOL. 01 / 2026</span></div>
              <h1>Your campus.<br/><em>Your knowledge.</em></h1>
              <p className="hero-description">A shared space for the notes, papers and ideas that move us forward. Find what you need. Keep learning together.</p>
              <div className="hero-actions">
                <button className="primary-button" onClick={() => {setActive('Resource library'); setCategory('All resources'); document.getElementById('library')?.scrollIntoView({behavior:'smooth'});}}>Explore library <ArrowUpRight size={16}/></button>
                <button className="text-button" onClick={() => setActive('Community')}>Visit community <ArrowRight size={15}/></button>
              </div>
            </div>
            <div className="hero-art" aria-label="Decorative academic archive illustration">
              <div className="art-index">ARCHIVE<br/>NO. 001</div>
              <div className="art-circle"><span>G</span></div>
              <div className="art-stamp">GBPIET<br/>EST. 1989</div>
              <div className="art-caption">KNOWLEDGE<br/>IS A COMMON<br/>RESOURCE.</div>
              <div className="art-cross">✳</div>
            </div>
            <div className="hero-foot"><span>01 — ACADEMIC RESOURCES</span><span>BUILT FOR STUDENTS, BY STUDENTS <b>↗</b></span></div>
          </section>

          <section className="stats-row" aria-label="Resource statistics">
            <div className="stat-cell"><span className="stat-number">07</span><span className="stat-label">DEPARTMENTS</span></div>
            <div className="stat-cell"><span className="stat-number">08</span><span className="stat-label">SEMESTERS</span></div>
            <div className="stat-cell"><span className="stat-number">∞</span><span className="stat-label">WAYS TO LEARN</span></div>
            <div className="stats-note">One growing library.<br/><strong>Shared by GBPIET.</strong></div>
          </section>

          <section className="library-section" aria-label="Browse by department and semester">
            <div className="section-heading">
              <div>
                <div className="eyebrow">BROWSE YOUR COURSE / 000</div>
                <h2>Choose your <em>path.</em></h2>
              </div>
            </div>
            <div className="search-panel">
              <div className="filter-row">
                <label>
                  <span>DEPARTMENT</span>
                  <select value={department === 'All departments' ? '' : department}
                    onChange={e => setDepartment(e.target.value || 'All departments')}>
                    <option value="">Choose department</option>
                    {departments.filter(d => d !== 'All departments').map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </label>
                <label>
                  <span>SEMESTER</span>
                  <select value={selectedSemester} onChange={e => setSelectedSemester(e.target.value)}>
                    {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(s => <option key={s} value={s}>Semester {s}</option>)}
                  </select>
                </label>
              </div>
            </div>
            {department === 'All departments' ? (
              <p className="library-footer">SELECT A DEPARTMENT TO VIEW ITS SUBJECTS.</p>
            ) : subjectLoading ? (
              <p className="library-footer">LOADING SUBJECTS…</p>
            ) : subjectError ? (
              <p role="alert" className="library-footer">{subjectError}</p>
            ) : subjects.length === 0 ? (
              <p className="library-footer">NO SUBJECTS ADDED FOR THIS DEPARTMENT AND SEMESTER YET.</p>
            ) : (
              <div className="resource-grid">
                {subjects.map(subject => (
                  <button
                    key={subject.id}
                    className="resource-card"
                    style={{ textAlign: 'left', cursor: 'pointer', padding: '18px', color: 'var(--ink)' }}
                    onClick={() => { setSelectedSubject(subject.id); setActive('Resource library'); setCategory('All resources'); document.getElementById('library')?.scrollIntoView({ behavior: 'smooth' }); }}
                    aria-pressed={selectedSubject === subject.id}
                  >
                    <div className="eyebrow">SEMESTER {subject.semester}</div>
                    <h3 style={{ margin: '12px 0 6px' }}>{subject.name}</h3>
                    <p style={{ color: 'var(--muted)', fontSize: '10px' }}>{subject.code || 'SUBJECT'}</p>
                    <div className="resource-bottom">
                      <span>{selectedSubject === subject.id ? 'SELECTED' : 'VIEW SUBJECT'}</span>
                      <ArrowUpRight size={14}/>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="library-section" id="library">
            <div className="section-heading">
              <div><div className="eyebrow">THE COLLECTION / 001</div><h2>{selectedSubjectRow ? <>{selectedSubjectRow.name} <em>resources.</em></> : <>Find your next <em>read.</em></>}</h2>{selectedSubjectRow && <p className="library-footer">{department} · SEMESTER {selectedSubjectRow.semester}</p>}</div>
              <button className="section-link" onClick={() => {setActive('Resource library'); setShowAll(!showAll)}}>{showAll ? 'Show less' : 'View all resources'} <ArrowUpRight size={15}/></button>
            </div>

            {departmentError && <p role="status">{departmentError}</p>}
            <div className="search-panel">
              <div className="search-input-wrap"><Search size={18}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search notes, papers, subjects, keywords..." aria-label="Search resources"/><kbd><Command size={11}/> K</kbd></div>
              <div className="filter-row">
                <label><span>DEPARTMENT</span><select value={department} onChange={e => setDepartment(e.target.value)}>{departments.map(d => <option key={d}>{d}</option>)}</select></label>
                <label><span>RESOURCE TYPE</span><select value={category} onChange={e => setCategory(e.target.value)}>{categories.map(c => <option key={c}>{c}</option>)}</select></label>
                <div className="view-switch" aria-label="Choose resource layout">
                  <button className={view === 'grid' ? 'selected' : ''} onClick={() => setView('grid')}>Grid</button>
                  <button className={view === 'list' ? 'selected' : ''} onClick={() => setView('list')}>List</button>
                </div>
              </div>
            </div>

            {!selectedSubject && homepageLoading && <p className="library-footer">LOADING THE COLLECTION…</p>}
            {!selectedSubject && homepageError && <p role="alert" className="library-footer">{homepageError}</p>}
            {selectedSubject && resourceLoading && <p className="library-footer">LOADING PUBLISHED RESOURCES…</p>}
            {selectedSubject && resourceError && <p role="alert" className="library-footer">{resourceError}</p>}
            <div className="collection-meta"><span>{filtered.length} RESOURCES SHOWN</span><label className="collection-sort"><SlidersHorizontal size={13}/><span>SORT</span><select aria-label="Sort resources" value={resourceSort} onChange={e => setResourceSort(e.target.value)}><option value="recent">Recently added</option><option value="featured">Featured first</option><option value="downloads">Most downloaded</option><option value="title">Title A–Z</option></select><ChevronDown size={13}/></label></div>
            <div className={`resource-grid ${view === 'list' ? 'list-view' : ''}`}>
              {filtered.slice(0, showAll ? filtered.length : 4).map((item, index) => (
                <article className="resource-card" key={item.id}>
                  <div className="card-topline"><span className="file-type"><File size={13}/> {item.format}</span>{item.tag && <span className={`tag ${item.tag === 'NEW' ? 'tag-new' : 'tag-popular'}`}>{item.tag}</span>}</div>
                  <div className="document-preview"><div className="doc-sheet"><div className="doc-brand">GBPIET Stack / {item.dept}</div><div className="doc-rule"/><div className="doc-title">{item.title}</div><div className="doc-lines"><i/><i/><i/><i/></div><div className="doc-footer">GBPIET · {item.year}</div></div><div className="doc-number">0{index + 1}</div></div>
                  <div className="resource-info">
                    <div className="resource-type">{item.type.toUpperCase()} <span>·</span> {item.sem.toUpperCase()}</div>
                    <h3>{item.title}</h3><p>{item.subtitle}</p>
                    <div className="resource-bottom"><span>{item.dept} <b>·</b> {item.date}</span><span><Download size={13}/> {item.downloads}</span></div>
                  </div>
                  <div className="card-actions"><button onClick={() => openResourcePreview(item)}>Preview <ArrowUpRight size={14}/></button><button onClick={() => downloadResource(item)} aria-label={`Download ${item.title}`}><Download size={15}/> Download</button><button aria-label="Save resource" onClick={() => alert('Bookmarks will be connected in the next development phase.')}><Bookmark size={15}/></button></div>
                </article>
              ))}
              {filtered.length === 0 && !(selectedSubject ? resourceLoading : homepageLoading) && <div className="empty-state"><Search size={24}/><h3>{selectedSubject ? 'No published resources yet' : 'No resources found'}</h3><p>{selectedSubject ? 'There are no published PDFs for this subject yet. Check back later.' : 'Try another keyword or change your filters.'}</p><button className="text-button" onClick={() => {setQuery('');setDepartment('All departments');setCategory('All resources');setSelectedSubject('')}}>Clear filters <ArrowRight size={14}/></button></div>}
            </div>
            <div className="library-footer"><span>{selectedSubject ? 'SHOWING PUBLISHED SUBJECT RESOURCES' : 'SHOWING ALL PUBLISHED RESOURCES'}</span><span>{selectedSubject ? 'PRIVATE PDF PREVIEW ENABLED' : 'LIVE COLLECTION · UPDATED FROM STACK DATABASE'} <ArrowRight size={13}/></span></div>
          </section>

          <section className="bottom-panels">
            <div className="announcement-panel" id="announcements">
              <div className="panel-heading"><div className="eyebrow">NOTICE BOARD / 002</div><Megaphone size={18}/></div>
              <h2>From the <em>notice board.</em></h2>
              {announcementLoading ? (
                <p className="library-footer">LOADING ANNOUNCEMENTS…</p>
              ) : studentAnnouncements.length > 0 ? (
                studentAnnouncements.map(item => (
                  <div className="notice-item" key={item.id}>
                    <span className="notice-date">{formatResourceDate(item.created_at).toUpperCase()}</span>
                    <div><strong>{item.title}</strong><p style={{ whiteSpace: 'pre-wrap' }}>{item.body}</p></div>
                    <span className="new-label">NOTICE</span>
                  </div>
                ))
              ) : (
                <p className="library-footer">NO ANNOUNCEMENTS HAVE BEEN PUBLISHED YET.</p>
              )}
            </div>
            <div className="announcement-panel" id="resource-request">
              <div className="panel-heading"><div className="eyebrow">STUDENT SUPPORT / 004</div><FileText size={18}/></div>
              <h2>Can't find a <em>resource?</em></h2>
              <p>Tell us what you need. The Stack team will review your request.</p>
              <form onSubmit={submitResourceRequest} style={{ display: 'grid', gap: 12, marginTop: 18 }}>
                <label>
                  <span>YOUR NAME</span>
                  <input value={requestForm.studentName} onChange={e => setRequestForm(v => ({ ...v, studentName: e.target.value }))} placeholder="Enter your name" required maxLength={100} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                </label>
                <div className="filter-row">
                  <label style={{ flex: '1 1 180px' }}>
                    <span>DEPARTMENT</span>
                    <select value={requestForm.departmentId} onChange={e => setRequestForm(v => ({ ...v, departmentId: e.target.value, subjectId: '' }))} required style={{ width: '100%', marginTop: 6 }}>
                      <option value="">Choose department</option>
                      {departmentRows.map(dept => <option key={dept.id} value={dept.id}>{dept.name} ({dept.code})</option>)}
                    </select>
                  </label>
                  <label style={{ flex: '1 1 130px' }}>
                    <span>SEMESTER</span>
                    <select value={requestForm.semester} onChange={e => setRequestForm(v => ({ ...v, semester: e.target.value, subjectId: '' }))} style={{ width: '100%', marginTop: 6 }}>
                      {Array.from({ length: 8 }, (_, i) => String(i + 1)).map(sem => <option key={sem} value={sem}>Semester {sem}</option>)}
                    </select>
                  </label>
                </div>
                <label>
                  <span>SUBJECT</span>
                  <select value={requestForm.subjectId} onChange={e => setRequestForm(v => ({ ...v, subjectId: e.target.value }))} required disabled={!requestForm.departmentId || requestSubjectsLoading} style={{ width: '100%', marginTop: 6 }}>
                    <option value="">{requestSubjectsLoading ? 'Loading subjects…' : 'Choose subject'}</option>
                    {requestSubjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
                  </select>
                </label>
                <label>
                  <span>RESOURCE TYPE</span>
                  <select value={requestForm.resourceType} onChange={e => setRequestForm(v => ({ ...v, resourceType: e.target.value }))} style={{ width: '100%', marginTop: 6 }}>
                    {['Notes', 'Previous Papers', 'Assignments', 'Lab Manuals', 'Syllabus', 'Other'].map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </label>
                <label>
                  <span>WHAT DO YOU NEED?</span>
                  <textarea value={requestForm.description} onChange={e => setRequestForm(v => ({ ...v, description: e.target.value }))} placeholder="Mention the unit, topic, academic year or any useful details..." rows={4} required maxLength={2000} style={{ width: '100%', boxSizing: 'border-box', marginTop: 6 }} />
                </label>
                {requestError && <p role="alert" style={{ color: 'var(--accent, #b34b35)' }}>{requestError}</p>}
                {requestMessage && <p role="status">{requestMessage}</p>}
                <button type="submit" className="primary-button" disabled={requestSubmitting || requestSubjectsLoading}>
                  {requestSubmitting ? 'Submitting…' : 'Submit resource request'} <ArrowUpRight size={15}/>
                </button>
              </form>
            </div>
            <div className="community-panel">
              <div className="eyebrow">THE COMMON ROOM / 003</div>
              <div className="community-symbol">✳</div>
              <h2>Good questions<br/>make <em>good company.</em></h2>
              <p>Discuss a subject, ask for help or share something useful with fellow students.</p>
              <button className="outline-button" onClick={() => setActive('Community')}>Explore community <ArrowUpRight size={15}/></button>
            </div>
          </section>

          <footer className="footer">
            <div className="footer-brand">STACK<span>.</span></div>
            <span>AN INDEPENDENT STUDENT RESOURCE PROJECT FOR GBPIET.</span>
            <span>MADE TO BE SHARED <b>✳</b> 2026</span>
          </footer>
          </>
          )}
        </div>
      </main>
    </div>
  );
}

createRoot(document.getElementById('root')).render(<App />);

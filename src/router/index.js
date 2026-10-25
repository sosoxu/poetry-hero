import { createRouter, createWebHashHistory } from 'vue-router';
import Home from '../views/HomeView.vue';
import PoemList from '../views/PoemListView.vue';
import PoemDetail from '../views/PoemDetailView.vue';
import Timeline from '../views/TimelineView.vue';
import Goals from '../views/GoalsView.vue';
import AddPoem from '../views/AddPoemView.vue';
import Settings from '../views/SettingsView.vue';
import Quiz from '../views/QuizView.vue';

const routes = [
  { path: '/', name: 'home', component: Home },
  { path: '/poems', name: 'poems', component: PoemList },
  { path: '/poem/:id', name: 'poem', component: PoemDetail },
  { path: '/timeline', name: 'timeline', component: Timeline },
  { path: '/goals', name: 'goals', component: Goals },
  { path: '/quiz', name: 'quiz', component: Quiz },
  { path: '/add', name: 'add', component: AddPoem },
  { path: '/settings', name: 'settings', component: Settings },
  { path: '/:pathMatch(.*)*', redirect: '/' }
];

export default createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior(to, from, saved) {
    return saved || { top: 0 };
  }
});

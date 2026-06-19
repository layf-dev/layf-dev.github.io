const { createApp, ref, computed, onMounted, onUnmounted, nextTick, watch } = Vue;

createApp({
    setup() {
        const currentView = ref('map'); 
        const isDark = ref(false);
        const MAX_POINTS = 10000;

        const toggleDark = () => {
            isDark.value = !isDark.value;
            if (isDark.value) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        };

        const teams = ref([
            { id: 1, name: 'Группа B', points: 5276, displayPoints: 5276, color: '#06b6d4', x: -100, y: -100 },
            { id: 2, name: 'Группа C', points: 3284, displayPoints: 3284, color: '#ec4899', x: -100, y: -100 },
            { id: 3, name: 'Группа D', points: 3122, displayPoints: 3122, color: '#8b5cf6', x: -100, y: -100 },
            { id: 4, name: 'Группа F', points: 2429, displayPoints: 2429, color: '#10b981', x: -100, y: -100 },
            { id: 5, name: 'Группа A', points: 2186, displayPoints: 2186, color: '#f59e0b', x: -100, y: -100 },
            { id: 6, name: 'Группа E', points: 205, displayPoints: 205, color: '#ef4444', x: -100, y: -100 },
        ]);

        const history = ref([
            { id: 1, teamId: 1, points: 500, reason: 'Победа в хакатоне', date: '15.02.2025 10:00' },
            { id: 2, teamId: 2, points: 300, reason: 'Решение алгоритма', date: '15.02.2025 11:30' }
        ]);

        const sortedTeams = computed(() => {
            return [...teams.value].sort((a, b) => b.points - a.points);
        });

        const selectedTeam = ref(null);

        // Map logic
        const pathLength = ref(0);
        const maxProgressPx = ref(0);
        const trackPathD = ref('');
        const isDrawing = ref(true); // For initial animation

        const calculatePositions = () => {
            if (currentView.value !== 'map') return;
            const path = document.getElementById('mainTrack');
            if (!path) return;

            trackPathD.value = path.getAttribute('d');
            const length = path.getTotalLength();
            pathLength.value = length;

            let highestPoints = 0;

            teams.value.forEach(team => {
                if (team.points > highestPoints) highestPoints = team.points;
                const progress = Math.min((team.points / MAX_POINTS), 1.0);
                const distance = progress * length;
                const point = path.getPointAtLength(distance);
                
                team.x = point.x;
                team.y = point.y;
            });

            const maxProgress = Math.min((highestPoints / MAX_POINTS), 1.0);
            maxProgressPx.value = maxProgress * length;
        };

        // Number animation logic
        const animateValue = (team, start, end, duration) => {
            let startTimestamp = null;
            const step = (timestamp) => {
                if (!startTimestamp) startTimestamp = timestamp;
                const progress = Math.min((timestamp - startTimestamp) / duration, 1);
                team.displayPoints = Math.floor(progress * (end - start) + start);
                if (progress < 1) {
                    window.requestAnimationFrame(step);
                } else {
                    team.displayPoints = end;
                }
            };
            window.requestAnimationFrame(step);
        };

        // Tooltip logic
        const hoveredTeam = ref(null);
        const tooltipStyle = ref({ top: '0px', left: '0px' });

        const showTooltip = (team, event) => {
            hoveredTeam.value = team;
            updateTooltipPos(event);
        };
        const hideTooltip = () => {
            hoveredTeam.value = null;
        };
        const updateTooltipPos = (event) => {
            if (hoveredTeam.value) {
                tooltipStyle.value = {
                    top: (event.clientY - 60) + 'px',
                    left: (event.clientX + 20) + 'px'
                };
            }
        };

        watch(teams, (newVal, oldVal) => {
            nextTick(() => calculatePositions());
        }, { deep: true });

        watch(currentView, (newVal) => {
            if (newVal === 'map') {
                nextTick(() => calculatePositions());
            }
        });

        onMounted(() => {
            calculatePositions();
            window.addEventListener('resize', calculatePositions);
            
            // Initial draw animation
            setTimeout(() => {
                isDrawing.value = false;
            }, 100);
        });

        onUnmounted(() => {
            window.removeEventListener('resize', calculatePositions);
        });

        const adminForm = ref({ teamId: 1, points: 100, reason: '' });
        const notification = ref(null);

        const addPoints = () => {
            if (!adminForm.value.reason) {
                alert('Укажите причину');
                return;
            }
            const team = teams.value.find(t => t.id === adminForm.value.teamId);
            if (team) {
                const oldPoints = team.points;
                team.points += adminForm.value.points;
                if (team.points < 0) team.points = 0;
                
                // Animate numbers
                animateValue(team, oldPoints, team.points, 1500);

                const now = new Date();
                const dateStr = `${now.getDate().toString().padStart(2,'0')}.${(now.getMonth()+1).toString().padStart(2,'0')}.${now.getFullYear()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
                
                history.value.unshift({
                    id: Date.now(),
                    teamId: team.id,
                    points: adminForm.value.points,
                    reason: adminForm.value.reason,
                    date: dateStr
                });
                
                notification.value = `🔥 Команде ${team.name} добавлено ${adminForm.value.points} баллов!`;
                setTimeout(() => notification.value = null, 3000);

                adminForm.value.points = 100;
                adminForm.value.reason = '';
            }
        };

        const getTeamName = (id) => teams.value.find(t => t.id === id)?.name || 'Unknown';
        const getTeamColor = (id) => teams.value.find(t => t.id === id)?.color || '#000';
        const openTeamHistory = (team) => {
            selectedTeam.value = team;
            hideTooltip();
        };
        const teamHistory = (id) => history.value.filter(log => log.teamId === id);

        return {
            currentView,
            isDark,
            toggleDark,
            teams,
            sortedTeams,
            history,
            pathLength,
            maxProgressPx,
            trackPathD,
            isDrawing,
            hoveredTeam,
            tooltipStyle,
            showTooltip,
            hideTooltip,
            updateTooltipPos,
            adminForm,
            addPoints,
            getTeamName,
            getTeamColor,
            selectedTeam,
            openTeamHistory,
            teamHistory,
            notification
        };
    }
}).mount('#app');

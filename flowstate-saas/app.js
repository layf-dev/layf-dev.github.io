document.addEventListener("DOMContentLoaded", () => {
    /* ==========================================================================
       INTERACTIVE DASHBOARD WIDGET LOGIC
       ========================================================================== */
    const tasksList = document.getElementById("tasks-list");
    const taskCounter = document.getElementById("task-counter");
    const newTaskInput = document.getElementById("new-task-input");
    const newTaskCategory = document.getElementById("new-task-category");
    const filterButtons = document.querySelectorAll(".filter-btn");
    
    let currentCategoryFilter = "all";

    // Re-calculate the counter of ACTIVE (uncompleted) tasks
    function updateTaskCounter() {
        const activeTasks = tasksList.querySelectorAll(".task-item:not(.completed)").length;
        taskCounter.textContent = `${activeTasks} active task${activeTasks === 1 ? '' : 's'}`;
    }

    // Bind event listeners to task elements (for completion checkbox)
    function bindTaskEvents(taskElement) {
        const checkbox = taskElement.querySelector(".checkbox-btn");
        checkbox.addEventListener("click", () => {
            taskElement.classList.toggle("completed");
            updateTaskCounter();
            applyCategoryFilter(currentCategoryFilter);
        });
    }

    // Initialize events for pre-existing tasks
    const initialTasks = tasksList.querySelectorAll(".task-item");
    initialTasks.forEach(task => bindTaskEvents(task));
    updateTaskCounter();

    // Create a new task element
    function createTask(text, category) {
        const li = document.createElement("li");
        li.className = "task-item";
        li.setAttribute("data-category", category);

        // Get category label class & text
        let pillClass = "pill-design";
        let categoryLabel = "Design";
        if (category === "code") {
            pillClass = "pill-code";
            categoryLabel = "Engineering";
        } else if (category === "marketing") {
            pillClass = "pill-marketing";
            categoryLabel = "Growth";
        }

        li.innerHTML = `
            <div class="task-left">
                <button class="checkbox-btn" aria-label="Complete task"><i class="fa-solid fa-check"></i></button>
                <span class="task-text">${escapeHtml(text)}</span>
            </div>
            <span class="category-pill ${pillClass}">${categoryLabel}</span>
        `;

        bindTaskEvents(li);
        tasksList.appendChild(li);
        updateTaskCounter();
        applyCategoryFilter(currentCategoryFilter);
    }

    // Input submission (Press Enter to add task)
    newTaskInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const text = newTaskInput.value.trim();
            const category = newTaskCategory.value;

            if (text) {
                createTask(text, category);
                newTaskInput.value = "";
            }
        }
    });

    // Apply active category filtering
    function applyCategoryFilter(category) {
        currentCategoryFilter = category;
        const tasks = tasksList.querySelectorAll(".task-item");
        
        tasks.forEach(task => {
            const taskCat = task.getAttribute("data-category");
            if (category === "all" || taskCat === category) {
                task.style.display = "flex";
            } else {
                task.style.display = "none";
            }
        });
    }

    // Bind sidebar filter button events
    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            
            const category = btn.getAttribute("data-category");
            applyCategoryFilter(category);
        });
    });

    // Helper to escape HTML characters
    function escapeHtml(text) {
        const map = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#039;'
        };
        return text.replace(/[&<>"']/g, function(m) { return map[m]; });
    }

    /* ==========================================================================
       PRICING BILLING INTERVAL TOGGLE
       ========================================================================== */
    const billingToggleBtn = document.getElementById("billing-toggle-btn");
    const monthlyLabel = document.getElementById("monthly-label");
    const yearlyLabel = document.getElementById("yearly-label");
    const teamPrice = document.getElementById("team-price");
    
    let isYearly = false;

    billingToggleBtn.addEventListener("click", () => {
        isYearly = !isYearly;
        
        // Toggle active states
        billingToggleBtn.classList.toggle("active", isYearly);
        monthlyLabel.classList.toggle("active", !isYearly);
        yearlyLabel.classList.toggle("active", isYearly);
        
        // Update Price Values
        if (isYearly) {
            // $9/mo billed yearly ($108 total)
            teamPrice.textContent = "9";
        } else {
            // $12/mo monthly
            teamPrice.textContent = "12";
        }
    });
});

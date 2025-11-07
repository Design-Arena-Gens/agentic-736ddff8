"use client";

import { useMemo, useState } from "react";
import { roles, type HeistRole, type HeistTask } from "../data/characters";

type PhaseFilter = HeistTask["phase"] | "All";

const phases: PhaseFilter[] = ["All", "Planning", "Execution", "Containment", "Escape"];

export default function Home() {
  const [search, setSearch] = useState("");
  const [phase, setPhase] = useState<PhaseFilter>("All");

  const filteredRoles = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const matchSearch = (role: HeistRole, task: HeistTask) => {
      if (!normalizedSearch) return true;
      return (
        role.codename.toLowerCase().includes(normalizedSearch) ||
        role.realName.toLowerCase().includes(normalizedSearch) ||
        role.specialty.toLowerCase().includes(normalizedSearch) ||
        role.summary.toLowerCase().includes(normalizedSearch) ||
        task.name.toLowerCase().includes(normalizedSearch) ||
        task.description.toLowerCase().includes(normalizedSearch)
      );
    };

    return roles
      .map((role) => {
        const tasks = role.tasks.filter((task) => {
          const phaseMatch = phase === "All" || task.phase === phase;
          return phaseMatch && matchSearch(role, task);
        });
        return tasks.length > 0 || !normalizedSearch
          ? { ...role, tasks: phase === "All" && !normalizedSearch ? role.tasks : tasks }
          : null;
      })
      .filter((item): item is HeistRole => Boolean(item));
  }, [search, phase]);

  const someFilteredTasks = filteredRoles.some((role) => role.tasks.length > 0);

  return (
    <main className="wrapper">
      <section className="hero">
        <header className="hero__header">
          <span className="hero__tag">Heist Operating System</span>
          <h1>Money Heist Role Taskboard</h1>
        </header>
        <p className="hero__subtitle">
          Explore character assignments across planning, execution, containment, and escape phases.
          Filter by codename, specialty, or task descriptions to assemble your crew playbook.
        </p>
        <div className="controls">
          <div className="search">
            <label htmlFor="search" className="sr-only">
              Search characters and tasks
            </label>
            <input
              id="search"
              placeholder="Search codename, role, or task..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <div className="phase">
            {phases.map((option) => (
              <button
                key={option}
                type="button"
                className={option === phase ? "phase__button phase__button--active" : "phase__button"}
                onClick={() => setPhase(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="roles">
        {filteredRoles.map((role) => (
          <article key={role.codename} className="role-card">
            <header className="role-card__header">
              <div className="role-card__identity">
                <span className="role-card__codename">{role.codename}</span>
                <span className="role-card__realname">{role.realName}</span>
              </div>
              <span className="role-card__specialty">{role.specialty}</span>
            </header>
            <p className="role-card__summary">{role.summary}</p>
            <div className="role-card__tasks">
              {role.tasks.map((task) => (
                <div key={task.id} className="task-card">
                  <div className="task-card__phase">{task.phase}</div>
                  <div className="task-card__body">
                    <h3>{task.name}</h3>
                    <p>{task.description}</p>
                  </div>
                </div>
              ))}
              {role.tasks.length === 0 && (
                <div className="task-card task-card--empty">
                  <p>No tasks match this combination. Adjust your filters to reveal assignments.</p>
                </div>
              )}
            </div>
          </article>
        ))}

        {!someFilteredTasks && (
          <div className="empty-state">
            <h2>No assignments located</h2>
            <p>
              Try broadening your search keywords or switching phases to reveal relevant heist duties.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../App'

vi.mock('../pages/Login', () => ({
  default: () => <div>Login Page</div>,
}))

vi.mock('../pages/Profile', () => ({
  default: () => <div>Profile Page</div>,
}))

vi.mock('../pages/TasksCreate', () => ({
  default: () => <div>TasksCreate Page</div>,
}))

vi.mock('../pages/Create', () => ({
  default: () => <div>Create Page</div>,
}))

vi.mock('../pages/FunctionList', () => ({
  default: () => <div>FunctionList Page</div>,
}))

vi.mock('../pages/TaskEdit', () => ({
  default: () => <div>TaskEdit Page</div>,
}))

describe('App Routing', () => {
  test('"/" → Login', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Login Page')
    ).toBeInTheDocument()
  })

  test('"/profile" → Profile', () => {
    render(
      <MemoryRouter initialEntries={['/profile']}>
        <App />
      </MemoryRouter>
    )

    expect(
      screen.getByText('Profile Page')
    ).toBeInTheDocument()
  })

  test('"/taskscreate" → TasksCreate', () => {
    render(
      <MemoryRouter initialEntries={['/taskscreate']}>
        <App />
      </MemoryRouter>
    )

    expect(
      screen.getByText('TasksCreate Page')
    ).toBeInTheDocument()
  })
})
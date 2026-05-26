import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import TasksCreate from '../pages/TasksCreate'
const mockNavigate = vi.fn()

vi.mock(
  'react-router-dom',
  async () => {
    const actual =
      await vi.importActual(
        'react-router-dom'
      )

    return {
      ...actual,
      useNavigate: () =>
        mockNavigate,
    }
  }
)
globalThis.fetch = vi.fn()

const renderTasksCreate = () => {
  return render(
    <MemoryRouter>
      <TasksCreate />
    </MemoryRouter>
  )
}

describe('TasksCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockNavigate.mockClear()

    localStorage.clear()

    localStorage.setItem(
      'token',
      'fake-token'
    )

    vi.mocked(globalThis.fetch)
      .mockResolvedValue({
        ok: true,
        json: async () => ({
          name: 'test user',
        }),
      } as Response)
  })

  test('タイトル入力欄表示', () => {
    renderTasksCreate()

    expect(
      screen.getByPlaceholderText(
        'Title'
      )
    ).toBeInTheDocument()
  })

  test('説明入力欄表示', () => {
    renderTasksCreate()

    expect(
      screen.getByPlaceholderText(
        'Description'
      )
    ).toBeInTheDocument()
  })

  test('Createボタン表示', () => {
    renderTasksCreate()

    expect(
      screen.getByRole('button', {
        name: /create/i,
      })
    ).toBeInTheDocument()
  })

  test('タイトル入力できる', async () => {
    renderTasksCreate()

    const user =
      userEvent.setup()

    const input =
      screen.getByPlaceholderText(
        'Title'
      )

    await user.type(
      input,
      'テストタスク'
    )

    expect(input)
      .toHaveValue(
        'テストタスク'
      )
  })

  test('説明入力できる', async () => {
    renderTasksCreate()

    const user =
      userEvent.setup()

    const textarea =
      screen.getByPlaceholderText(
        'Description'
      )

    await user.type(
      textarea,
      'テスト説明'
    )

    expect(textarea)
      .toHaveValue(
        'テスト説明'
      )
  })

  test('status変更できる', async () => {
    renderTasksCreate()

    const user =
      userEvent.setup()

    const select =
      screen.getByRole(
        'combobox'
      )

    await user.selectOptions(
      select,
      'doing'
    )

    expect(select)
      .toHaveValue(
        'doing'
      )
  })
  test('Create押下でAPI送信される', async () => {
    const user =
      userEvent.setup()

    renderTasksCreate()

    await user.type(
      screen.getByPlaceholderText(
        'Title'
      ),
      'テストタスク'
    )

    await user.type(
      screen.getByPlaceholderText(
        'Description'
      ),
      'テスト説明'
    )

    await user.click(
      screen.getByRole(
        'button',
        {
          name: /create/i,
        }
      )
    )

    expect(
      globalThis.fetch
    ).toHaveBeenCalled()
  })
  test('API失敗時エラー表示', async () => {
    vi.mocked(globalThis.fetch)

      // useEffectの /me
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          name: 'test user'
        })
      } as Response)

      // Create時の /tasks
      .mockResolvedValueOnce({
        ok: false
      } as Response)

    const user = userEvent.setup()

    renderTasksCreate()

    await user.type(
      screen.getByPlaceholderText(
        'Title'
      ),
      'テスト'
    )

    await user.type(
      screen.getByPlaceholderText(
        'Description'
      ),
      '説明'
    )

    await user.click(
      screen.getByRole(
        'button',
        { name: /create/i }
      )
    )

    expect(
      await screen.findByText(
        'タスク作成に失敗しました'
      )
    ).toBeInTheDocument()
  })

  test(
    '作成成功で画面遷移',
    async () => {

      vi.clearAllMocks()

      vi.mocked(globalThis.fetch)

        // /me
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            name: 'test user'
          })
        } as Response)

        // create
        .mockResolvedValueOnce({
          ok: true
        } as Response)

      const user =
        userEvent.setup()

      renderTasksCreate()

      await user.type(
        screen.getByPlaceholderText(
          'Title'
        ),
        'React勉強'
      )

      await user.type(
        screen.getByPlaceholderText(
          'Description'
        ),
        'Vitest学習'
      )

      await user.click(
        screen.getByRole(
          'button',
          {
            name: /create/i
          }
        )
      )

      expect(
        mockNavigate
      ).toHaveBeenLastCalledWith(
        '/functionlist'
      )

    })
  test(
    'Back押下',
    async () => {

      const user =
        userEvent.setup()

      renderTasksCreate()

      await user.click(
        screen.getByRole(
          'button',
          {
            name: /back/i
          }
        )
      )

      expect(
        mockNavigate
      ).toHaveBeenLastCalledWith(
        '/functionlist'
      )

    })

  test(
    'Logout押下',
    async () => {

      const user =
        userEvent.setup()

      renderTasksCreate()

      // メニュー開く
      await user.click(
        screen.getByRole(
          'button',
          {
            name: 'menu-button'
          }
        )
      )

      await user.click(
        screen.getByText(
          /logout/i
        )
      )

      expect(
        localStorage.getItem(
          'token'
        )
      ).toBeNull()

      expect(
        mockNavigate
      ).toHaveBeenLastCalledWith(
        '/'
      )

    })
})
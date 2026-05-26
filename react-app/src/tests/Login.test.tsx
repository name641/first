import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import axios from 'axios'
import Login from '../pages/Login'

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

vi.mock('axios')

const mockedAxios =
  vi.mocked(axios)

const renderLogin = () => {
  return render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  )
}

describe(
  'Login',
  () => {

    beforeEach(() => {
      vi.clearAllMocks()
      localStorage.clear()
    })

    test(
      'ログイン成功',
      async () => {

        mockedAxios.post
          .mockResolvedValueOnce({
            data: {
              token:
                'fake-token'
            }
          })

        const user =
          userEvent.setup()

        renderLogin()

        await user.type(
          screen.getByPlaceholderText(
            'Enter your email'
          ),
          'test@example.com'
        )

        await user.type(
          screen.getByPlaceholderText(
            'Enter your password'
          ),
          'password'
        )

        await user.click(
          screen.getByRole(
            'button',
            {
              name: /login/i
            }
          )
        )

        expect(
          localStorage.getItem(
            'token'
          )
        ).toBe(
          'fake-token'
        )

        expect(
          mockNavigate
        ).toHaveBeenCalledWith(
          '/functionlist',
          {
            replace: true
          }
        )

      }
    )

    test(
      'ログイン失敗(401)',
      async () => {

        vi.mocked(
          axios.isAxiosError
        ).mockReturnValue(
          true
        )

        mockedAxios.post
          .mockRejectedValueOnce({
            response: {
              status: 401
            }
          })

        const user =
          userEvent.setup()

        renderLogin()

        await user.type(
          screen.getByPlaceholderText(
            'Enter your email'
          ),
          'test@example.com'
        )

        await user.type(
          screen.getByPlaceholderText(
            'Enter your password'
          ),
          'wrongpass'
        )

        await user.click(
          screen.getByRole(
            'button',
            {
              name: /login/i
            }
          )
        )

        expect(
          await screen.findByText(
            'メールアドレスまたはパスワードが間違っています'
          )
        ).toBeInTheDocument()
      }
    )

    test('500エラー表示', async () => {
      vi.mocked(
        axios.isAxiosError
      ).mockReturnValue(true)

      mockedAxios.post
        .mockRejectedValueOnce({
          response: {
            status: 500
          }
        })

      const user =
        userEvent.setup()

      renderLogin()

      await user.type(
        screen.getByPlaceholderText(
          'Enter your email'
        ),
        'test@example.com'
      )

      await user.type(
        screen.getByPlaceholderText(
          'Enter your password'
        ),
        'password'
      )

      await user.click(
        screen.getByRole(
          'button',
          {
            name: /login/i
          }
        )
      )

      expect(
        await screen.findByText(
          'サーバーエラーが発生しました'
        )
      ).toBeInTheDocument()
    })

    test(
      'パスワード表示切替',
      async () => {

        const user =
          userEvent.setup()

        renderLogin()

        const passwordInput =
          screen.getByPlaceholderText(
            'Enter your password'
          )

        expect(
          passwordInput
        ).toHaveAttribute(
          'type',
          'password'
        )

        const buttons =
          screen.getAllByRole(
            'button'
          )

        // 👁ボタン
        await user.click(
          buttons[0]
        )

        expect(
          passwordInput
        ).toHaveAttribute(
          'type',
          'text'
        )

      }
    )

    test(
      'Create accountリンク表示',
      () => {

        renderLogin()

        expect(
          screen.getByText(
            /create account/i
          )
        ).toBeInTheDocument()

      }
    )
  }
)
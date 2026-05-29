import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import Profile from '../pages/Profile'
import axios from 'axios'
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
const mockedAxios = vi.mocked(axios)

const mockUser = {
    id: 1,
    name: 'test user',
    email: 'test@test.com'
}

const renderProfile = () => {
    return render(
        <MemoryRouter>
            <Profile />
        </MemoryRouter>
    )
}

describe(
    'Profile',
    () => {

        beforeEach(() => {
            vi.clearAllMocks()

            mockNavigate.mockClear()

            localStorage.clear()

            localStorage.setItem(
                'token',
                'fake-token'
            )

            mockedAxios.get.mockResolvedValue({
                data: mockUser,
            } as any)

            // 👇 その他APIモック
            mockedAxios.put.mockResolvedValue({})
            mockedAxios.delete.mockResolvedValue({})
        })

        test(
            '初期表示',
            async () => {

                renderProfile()

                expect(
                    await screen.findByDisplayValue(
                        'test user'
                    )
                ).toBeInTheDocument()

                expect(
                    screen.getByDisplayValue(
                        'test@test.com'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            'name変更',
            async () => {

                const user =
                    userEvent.setup()

                renderProfile()

                const input =
                    await screen.findByDisplayValue(
                        'test user'
                    )

                await user.clear(
                    input
                )

                await user.type(
                    input,
                    'React User'
                )

                expect(
                    input
                ).toHaveValue(
                    'React User'
                )

            }
        )

        test(
            'email変更',
            async () => {

                const user =
                    userEvent.setup()

                renderProfile()

                const input =
                    await screen.findByDisplayValue(
                        'test@test.com'
                    )

                await user.clear(
                    input
                )

                await user.type(
                    input,
                    'new@test.com'
                )

                expect(
                    input
                ).toHaveValue(
                    'new@test.com'
                )

            }
        )

        test(
            'Update押下',
            async () => {

                const user =
                    userEvent.setup()

                renderProfile()

                await screen.findByDisplayValue(
                    'test user'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /update/i
                        }
                    )
                )

                expect(
                    mockedAxios.put
                ).toHaveBeenCalled()

            }
        )

        test(
            'Back押下',
            async () => {

                const user =
                    userEvent.setup()

                renderProfile()

                await screen.findByDisplayValue(
                    'test user'
                )

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
                ).toHaveBeenCalledWith(
                    '/functionlist'
                )

            }
        )

        test(
            'Logout押下',
            async () => {

                const user =
                    userEvent.setup()

                renderProfile()

                await screen.findByDisplayValue(
                    'test user'
                )

                const buttons =
                    screen.getAllByRole(
                        'button'
                    )

                await user.click(
                    buttons[0]
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
                ).toHaveBeenCalledWith(
                    '/'
                )

            }
        )

        test(
            'Deleteモーダル表示',
            async () => {

                const user =
                    userEvent.setup()

                renderProfile()

                await screen.findByDisplayValue(
                    'test user'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /delete account/i
                        }
                    )
                )

                expect(
                    screen.getByText(
                        /DELETE を入力してください/i
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            'アカウント削除',
            async () => {

                const user =
                    userEvent.setup()

                renderProfile()

                await screen.findByDisplayValue(
                    'test user'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: /delete account/i
                        }
                    )
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'DELETE'
                    ),
                    'DELETE'
                )

                await user.click(
                    screen.getByRole(
                        'button',
                        {
                            name: '削除する'
                        }
                    )
                )

                expect(
                    localStorage.getItem(
                        'token'
                    )
                ).toBeNull()

                expect(
                    mockNavigate
                ).toHaveBeenCalledWith(
                    '/'
                )

            }
        )

    })
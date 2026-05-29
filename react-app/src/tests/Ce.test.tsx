import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import axios from 'axios'
import Create from '../pages/Create'

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

const renderCe = () => {
    return render(
        <MemoryRouter>
            <Create />
        </MemoryRouter>
    )
}

describe(
    'Ce',
    () => {

        beforeEach(() => {

            vi.clearAllMocks()

            localStorage.clear()

            // ↓ここが重要
            vi.mocked(
                axios.isAxiosError
            ).mockReturnValue(true)

        })

        test(
            'Name入力欄表示',
            () => {

                renderCe()

                expect(
                    screen.getByPlaceholderText(
                        'Enter your name'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            'Email入力欄表示',
            () => {

                renderCe()

                expect(
                    screen.getByPlaceholderText(
                        'Enter your email'
                    )
                ).toBeInTheDocument()

            }
        )   

        test(
            'Password入力欄表示',
            () => {

                renderCe()

                expect(
                    screen.getByPlaceholderText(
                        'Create password'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            '登録成功',
            async () => {

                vi.mocked(
                    axios.post
                ).mockResolvedValueOnce(
                    {}
                )

                const user =
                    userEvent.setup()

                renderCe()

                await user.type(
                    screen.getByPlaceholderText(
                        'Enter your name'
                    ),
                    'test'
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'Enter your email'
                    ),
                    'test@test.com'
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'Create password'
                    ),
                    'password123'
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
                    await screen.findByText(
                        '登録成功！'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            '422バリデーションエラー',
            async () => {

                vi.mocked(
                    axios.post
                ).mockRejectedValueOnce({
                    response: {
                        status: 422,
                        data: {
                            errors: {
                                email: [
                                    'emailエラー'
                                ]
                            }
                        }
                    }
                })

                const user =
                    userEvent.setup()

                renderCe()

                await user.type(
                    screen.getByPlaceholderText(
                        'Enter your name'
                    ),
                    'test'
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'Enter your email'
                    ),
                    'test@test.com'
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'Create password'
                    ),
                    'password123'
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
                    await screen.findByText(
                        'emailエラー'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            '409メール重複',
            async () => {

                vi.mocked(
                    axios.post
                ).mockRejectedValueOnce({
                    response: {
                        status: 409
                    }
                })

                const user =
                    userEvent.setup()

                renderCe()

                await user.type(
                    screen.getByPlaceholderText(
                        'Enter your name'
                    ),
                    'test'
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'Enter your email'
                    ),
                    'test@test.com'
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'Create password'
                    ),
                    'password123'
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
                    await screen.findByText(
                        'このメールアドレスは既に使用されています'
                    )
                ).toBeInTheDocument()

            }
        )

        test(
            '登録失敗',
            async () => {

                vi.mocked(
                    axios.post
                ).mockRejectedValueOnce({
                    response: {
                        status: 500
                    }
                })

                const user =
                    userEvent.setup()

                renderCe()

                await user.type(
                    screen.getByPlaceholderText(
                        'Enter your name'
                    ),
                    'test'
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'Enter your email'
                    ),
                    'test@test.com'
                )

                await user.type(
                    screen.getByPlaceholderText(
                        'Create password'
                    ),
                    'password123'
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
                    await screen.findByText(
                        '登録に失敗しました'
                    )
                ).toBeInTheDocument()

            }
        )

    }
)
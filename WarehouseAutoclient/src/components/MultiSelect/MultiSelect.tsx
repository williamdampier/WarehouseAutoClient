import React, { useState, useRef, useEffect } from 'react'
import './MultiSelect.css'

type Option = { value: string; label: string }

interface MultiSelectProps {
    options: Option[]
    selected: Option[]
    onChange: (selected: Option[]) => void
    placeholder?: string
}

export function MultiSelect({ options, selected, onChange, placeholder }: MultiSelectProps) {
    const [isOpen, setIsOpen] = useState(false)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (ref.current && !ref.current.contains(event.target as Node)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [])

    const toggleOption = (option: Option) => {
        if (selected.find(o => o.value === option.value)) {
            onChange(selected.filter(o => o.value !== option.value))
        } else {
            onChange([...selected, option])
        }
    }

    const selectedLabels = selected.map(o => o.label).join(', ')

    return (
        <div className="multiselect" ref={ref}>
            <div
                className="multiselect-input"
                onClick={() => setIsOpen(open => !open)}
            >
                {selected.length === 0 ? placeholder || 'Выберите...' : selectedLabels}
            </div>

            {isOpen && (
                <div className="multiselect-dropdown">
                    {options.map(option => (
                        <label key={option.value}>
                            <input
                                type="checkbox"
                                checked={!!selected.find(o => o.value === option.value)}
                                onChange={() => toggleOption(option)}
                            />
                            {option.label}
                        </label>
                    ))}
                </div>
            )}
        </div>
    )
}

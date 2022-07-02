import { useEffect, useState } from 'react'
import { Switch } from '@headlessui/react'

export const ToggleSwitch = ({ label, className, name, value, action }) => {
    const [enabled, setEnabled] = useState(value || false)

    useEffect(() => {
        if (action) action(name || null, enabled)
    }, [enabled])

    return (
        <Switch.Group>
            <div className={`${className ? className : 'flex'} items-center`}>
                {label && (
                    <Switch.Label className="mr-4 block mb-2 text-sm font-medium text-gray-900">
                        {label}
                    </Switch.Label>
                )}
                <Switch
                    checked={enabled}
                    onChange={setEnabled}
                    className={`${
                        enabled ? 'bg-blue-600' : 'bg-gray-400'
                    } relative inline-flex h-6 w-11 items-center rounded-full transition-colors`}
                >
                    <span
                        className={`${
                            enabled ? 'translate-x-6' : 'translate-x-1'
                        } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                    />
                </Switch>
            </div>
        </Switch.Group>
    )
}

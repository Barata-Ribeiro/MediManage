import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: Readonly<SVGAttributes<SVGElement>>) {
    return (
        <svg {...props} xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 91.691 64.823">
            <g style={{ imageRendering: 'auto' }}>
                <path
                    fill="#124FC9"
                    d="M322.45 226.126V205h-19.444l-10.096 26.009a167.537 167.537 0 0 1 29.54-4.883m-55.561 14.007v-9.666l3.114 8.283c4.44-1.868 8.987-3.58 13.577-5.05L272.444 205H253v42.557a123.317 123.317 0 0 1 13.889-7.424m16.006 18.778q-2.186 1.476-4.185 2.933l3.002 7.979h12.033l8.227-21.849a151.967 151.967 0 0 0-19.077 10.937m25.666-13.932v24.844h13.89v-29.945q-7.088 2.223-13.89 5.1"
                    style={{
                        display: 'inline',
                        overflow: 'visible',
                        fillOpacity: 1,
                        strokeWidth: 3.47779,
                        imageRendering: 'auto',
                    }}
                    transform="translate(-253 -205)"
                />
                <path
                    fill="#46E861"
                    d="M262.766 269.823c13.901-13.017 40.975-32.605 81.925-39.369-26.887-3.244-65.365 4.584-91.691 21.836v17.533z"
                    style={{
                        display: 'inline',
                        overflow: 'visible',
                        fillOpacity: 1,
                        strokeWidth: 3.47779,
                        imageRendering: 'auto',
                    }}
                    transform="translate(-253 -205)"
                />
            </g>
        </svg>
    );
}

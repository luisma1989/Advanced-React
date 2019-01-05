import Link from 'next/link';

const Home = () => (
    <div>
        <p>Home</p>
        <Link href='/sell'>
            <a>
                sell
            </a>
        </Link>
    </div>
)

export default Home;
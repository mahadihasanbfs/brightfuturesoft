import { avatarColor, initials } from './mailApi';

export default function Avatar({ name, email, size = 40 }) {
      return (
            <span
                  className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold text-white ${avatarColor(email || name)}`}
                  style={{ width: size, height: size, fontSize: size * 0.38 }}
                  aria-hidden="true"
            >
                  {initials(name)}
            </span>
      );
}

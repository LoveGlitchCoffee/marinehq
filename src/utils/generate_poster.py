import argparse
from wantedposter.wantedposter import WantedPoster
import sys
import requests


def main(name, imagePath, bounty):
    # Create WantedPoster object
    wanted_poster = WantedPoster(
        requests.get(imagePath, stream=True).raw, name, "", bounty
    )

    # Generate poster
    path = wanted_poster.generate()
    print(path, file=sys.stderr)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("-n", dest="name", required=True)
    parser.add_argument("-i", dest="image", required=True)
    parser.add_argument("-b", dest="bounty", required=True, type=int)
    args = parser.parse_args()
    main(args.name, args.image, args.bounty)
